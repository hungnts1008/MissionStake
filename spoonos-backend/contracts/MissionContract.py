"""
MissionStake - Mission Smart Contract
NEO N3 Smart Contract for managing missions/tasks

Features:
- Create missions with rewards
- Complete missions
- Verify completion
- Distribute rewards
- Track mission stats
"""

from typing import Any, Union
from boa3.builtin import NeoMetadata, metadata, public
from boa3.builtin.contract import Nep17TransferEvent, abort
from boa3.builtin.interop.blockchain import get_contract, Transaction
from boa3.builtin.interop.runtime import calling_script_hash, check_witness, executing_script_hash
from boa3.builtin.interop.storage import delete, get, put, find
from boa3.builtin.type import UInt160


# Contract Metadata
@metadata
def manifest_metadata() -> NeoMetadata:
    meta = NeoMetadata()
    meta.author = "MissionStake Team"
    meta.description = "Mission Management Smart Contract"
    meta.email = "contact@missionstake.io"
    return meta


# Storage Keys
MISSION_COUNT_KEY = b'mission_count'
MISSION_PREFIX = b'mission:'
USER_MISSIONS_PREFIX = b'user_missions:'
COMPLETED_PREFIX = b'completed:'


# Mission Status
STATUS_PENDING = 0
STATUS_IN_PROGRESS = 1
STATUS_COMPLETED = 2
STATUS_VERIFIED = 3
STATUS_CANCELLED = 4


@public
def deploy() -> bool:
    """
    Deploy contract - chỉ chạy 1 lần khi deploy
    """
    put(MISSION_COUNT_KEY, 0)
    return True


@public
def create_mission(
    creator: UInt160,
    title: str,
    description: str,
    reward_amount: int,
    deadline: int,
    category: str
) -> int:
    """
    Tạo mission mới
    
    Args:
        creator: Địa chỉ người tạo mission
        title: Tiêu đề mission
        description: Mô tả chi tiết
        reward_amount: Số tiền thưởng (GAS)
        deadline: Unix timestamp deadline
        category: Loại mission (fitness, learning, work, etc.)
    
    Returns:
        mission_id: ID của mission vừa tạo
    """
    # Verify caller is the creator
    if not check_witness(creator):
        abort()
    
    # Validate inputs
    if len(title) == 0 or len(title) > 100:
        abort()
    if len(description) == 0 or len(description) > 500:
        abort()
    if reward_amount <= 0:
        abort()
    
    # Get next mission ID
    mission_count = get(MISSION_COUNT_KEY).to_int()
    mission_id = mission_count + 1
    
    # Store mission data
    mission_key = MISSION_PREFIX + mission_id.to_bytes()
    mission_data = {
        'id': mission_id,
        'creator': creator,
        'title': title,
        'description': description,
        'reward': reward_amount,
        'deadline': deadline,
        'category': category,
        'status': STATUS_PENDING,
        'assignee': b'',
        'created_at': 0,  # Will be set by block timestamp
        'completed_at': 0
    }
    
    # Serialize and store (simplified - in production use proper serialization)
    put(mission_key, str(mission_data))
    
    # Update mission count
    put(MISSION_COUNT_KEY, mission_id)
    
    # Add to creator's missions list
    user_key = USER_MISSIONS_PREFIX + creator
    user_missions = get(user_key)
    if len(user_missions) == 0:
        put(user_key, str([mission_id]))
    else:
        missions = eval(user_missions)  # Parse existing list
        missions.append(mission_id)
        put(user_key, str(missions))
    
    return mission_id


@public
def accept_mission(mission_id: int, user: UInt160) -> bool:
    """
    User nhận mission
    
    Args:
        mission_id: ID của mission
        user: Địa chỉ user nhận mission
    
    Returns:
        bool: True nếu thành công
    """
    # Verify caller
    if not check_witness(user):
        return False
    
    # Get mission
    mission_key = MISSION_PREFIX + mission_id.to_bytes()
    mission_data_str = get(mission_key)
    
    if len(mission_data_str) == 0:
        return False
    
    mission = eval(mission_data_str)
    
    # Check if mission is available
    if mission['status'] != STATUS_PENDING:
        return False
    
    # Update mission status and assignee
    mission['status'] = STATUS_IN_PROGRESS
    mission['assignee'] = user
    put(mission_key, str(mission))
    
    # Add to user's accepted missions
    user_key = USER_MISSIONS_PREFIX + user
    user_missions = get(user_key)
    if len(user_missions) == 0:
        put(user_key, str([mission_id]))
    else:
        missions = eval(user_missions)
        missions.append(mission_id)
        put(user_key, str(missions))
    
    return True


@public
def complete_mission(mission_id: int, user: UInt160, proof: str) -> bool:
    """
    User đánh dấu mission đã hoàn thành
    
    Args:
        mission_id: ID của mission
        user: Địa chỉ user hoàn thành
        proof: Bằng chứng hoàn thành (URL, hash, etc.)
    
    Returns:
        bool: True nếu thành công
    """
    # Verify caller
    if not check_witness(user):
        return False
    
    # Get mission
    mission_key = MISSION_PREFIX + mission_id.to_bytes()
    mission_data_str = get(mission_key)
    
    if len(mission_data_str) == 0:
        return False
    
    mission = eval(mission_data_str)
    
    # Verify user is assigned to this mission
    if mission['assignee'] != user:
        return False
    
    # Check status
    if mission['status'] != STATUS_IN_PROGRESS:
        return False
    
    # Update mission
    mission['status'] = STATUS_COMPLETED
    mission['completed_at'] = 0  # Will be block timestamp
    put(mission_key, str(mission))
    
    # Store proof
    proof_key = COMPLETED_PREFIX + mission_id.to_bytes()
    put(proof_key, proof)
    
    return True


@public
def verify_mission(mission_id: int, verifier: UInt160, approved: bool) -> bool:
    """
    Mission creator verify và phân phối reward
    
    Args:
        mission_id: ID của mission
        verifier: Địa chỉ người verify (phải là creator)
        approved: True nếu approve, False nếu reject
    
    Returns:
        bool: True nếu thành công
    """
    # Verify caller
    if not check_witness(verifier):
        return False
    
    # Get mission
    mission_key = MISSION_PREFIX + mission_id.to_bytes()
    mission_data_str = get(mission_key)
    
    if len(mission_data_str) == 0:
        return False
    
    mission = eval(mission_data_str)
    
    # Verify caller is creator
    if mission['creator'] != verifier:
        return False
    
    # Check status
    if mission['status'] != STATUS_COMPLETED:
        return False
    
    if approved:
        mission['status'] = STATUS_VERIFIED
        # TODO: Transfer reward to assignee
        # This would integrate with GAS token transfer
    else:
        mission['status'] = STATUS_IN_PROGRESS  # Return to in-progress
    
    put(mission_key, str(mission))
    
    return True


@public
def get_mission(mission_id: int) -> str:
    """
    Lấy thông tin mission
    
    Args:
        mission_id: ID của mission
    
    Returns:
        str: JSON string của mission data
    """
    mission_key = MISSION_PREFIX + mission_id.to_bytes()
    mission_data = get(mission_key)
    
    if len(mission_data) == 0:
        return ''
    
    return mission_data


@public
def get_user_missions(user: UInt160) -> str:
    """
    Lấy danh sách missions của user
    
    Args:
        user: Địa chỉ user
    
    Returns:
        str: JSON string array của mission IDs
    """
    user_key = USER_MISSIONS_PREFIX + user
    missions = get(user_key)
    
    if len(missions) == 0:
        return '[]'
    
    return missions


@public
def get_mission_count() -> int:
    """
    Lấy tổng số missions đã tạo
    
    Returns:
        int: Số lượng missions
    """
    count = get(MISSION_COUNT_KEY)
    if len(count) == 0:
        return 0
    return count.to_int()


@public
def cancel_mission(mission_id: int, creator: UInt160) -> bool:
    """
    Creator hủy mission (chỉ khi chưa có người nhận)
    
    Args:
        mission_id: ID của mission
        creator: Địa chỉ creator
    
    Returns:
        bool: True nếu thành công
    """
    # Verify caller
    if not check_witness(creator):
        return False
    
    # Get mission
    mission_key = MISSION_PREFIX + mission_id.to_bytes()
    mission_data_str = get(mission_key)
    
    if len(mission_data_str) == 0:
        return False
    
    mission = eval(mission_data_str)
    
    # Verify caller is creator
    if mission['creator'] != creator:
        return False
    
    # Can only cancel pending missions
    if mission['status'] != STATUS_PENDING:
        return False
    
    # Update status
    mission['status'] = STATUS_CANCELLED
    put(mission_key, str(mission))
    
    return True
