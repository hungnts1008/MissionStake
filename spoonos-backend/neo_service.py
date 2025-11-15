"""
NEO Blockchain Service
Service layer để tương tác với NEO smart contracts
"""
import os
import json
import requests
from typing import Dict, Any, Optional, List
from dotenv import load_dotenv

load_dotenv()


class NeoService:
    """
    Service để tương tác với NEO blockchain
    """
    
    def __init__(self):
        self.rpc_url = os.getenv("NEO_RPC_URL", "http://seed1t5.neo.org:20332")
        self.wallet_address = os.getenv("NEO_WALLET_ADDRESS", "")
        self.private_key = os.getenv("NEO_WALLET_PRIVATE_KEY", "")
        self.mission_contract = os.getenv("NEO_MISSION_CONTRACT", "")
        
    def _rpc_call(self, method: str, params: List = None) -> Dict[str, Any]:
        """
        Make RPC call to NEO node
        
        Args:
            method: RPC method name
            params: Method parameters
            
        Returns:
            RPC response data
        """
        if params is None:
            params = []
            
        payload = {
            "jsonrpc": "2.0",
            "method": method,
            "params": params,
            "id": 1
        }
        
        try:
            response = requests.post(
                self.rpc_url,
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                if "result" in data:
                    return data["result"]
                elif "error" in data:
                    raise Exception(f"RPC Error: {data['error']}")
            
            raise Exception(f"HTTP Error: {response.status_code}")
            
        except Exception as e:
            raise Exception(f"RPC call failed: {e}")
    
    def get_block_count(self) -> int:
        """Get current block height"""
        return self._rpc_call("getblockcount")
    
    def get_balance(self, address: str = None) -> Dict[str, float]:
        """
        Get GAS and NEO balance
        
        Args:
            address: NEO address (default: wallet address)
            
        Returns:
            Dict with 'GAS' and 'NEO' balances
        """
        if not address:
            address = self.wallet_address
            
        result = self._rpc_call("getnep17balances", [address])
        
        balances = {"GAS": 0.0, "NEO": 0.0}
        
        if "balance" in result:
            for balance in result["balance"]:
                asset_hash = balance.get("assethash", "")
                amount = int(balance.get("amount", 0)) / 100000000
                
                # GAS token
                if asset_hash == "0xd2a4cff31913016155e38e474a2c06d08be276cf":
                    balances["GAS"] = amount
                # NEO token
                elif asset_hash == "0xef4073a0f2b305a38ec4050e4d3d28bc40ea63f5":
                    balances["NEO"] = amount
        
        return balances
    
    def invoke_contract_read(self, contract_hash: str, operation: str, params: List = None) -> Any:
        """
        Invoke contract method (read-only)
        
        Args:
            contract_hash: Contract hash
            operation: Method name
            params: Method parameters
            
        Returns:
            Contract return value
        """
        if params is None:
            params = []
        
        invoke_params = [
            contract_hash,
            operation,
            params
        ]
        
        result = self._rpc_call("invokefunction", invoke_params)
        
        if "stack" in result and len(result["stack"]) > 0:
            return result["stack"][0]
        
        return None
    
    # ========== Mission Contract Methods ==========
    
    def create_mission(
        self,
        creator: str,
        title: str,
        description: str,
        reward_amount: int,
        deadline: int,
        category: str
    ) -> Dict[str, Any]:
        """
        Create new mission on blockchain
        
        Args:
            creator: Creator address
            title: Mission title
            description: Mission description
            reward_amount: Reward in GAS
            deadline: Unix timestamp
            category: Mission category
            
        Returns:
            Transaction info with mission_id
        """
        # For now, return mock data until contract is deployed
        # TODO: Replace with actual contract invocation
        
        mission_id = 1  # Mock ID
        
        return {
            "success": True,
            "mission_id": mission_id,
            "tx_hash": "0xmock_transaction_hash",
            "message": "Mission created successfully (mock)",
            "data": {
                "id": mission_id,
                "creator": creator,
                "title": title,
                "description": description,
                "reward": reward_amount,
                "deadline": deadline,
                "category": category,
                "status": "PENDING"
            }
        }
    
    def get_mission(self, mission_id: int) -> Optional[Dict[str, Any]]:
        """
        Get mission details from blockchain
        
        Args:
            mission_id: Mission ID
            
        Returns:
            Mission data or None
        """
        # Mock data until contract deployed
        # TODO: Replace with actual contract call
        
        return {
            "id": mission_id,
            "creator": self.wallet_address,
            "title": f"Mission #{mission_id}",
            "description": "Complete this awesome mission!",
            "reward": 5,
            "deadline": 1700000000,
            "category": "fitness",
            "status": "PENDING",
            "assignee": "",
            "created_at": 1699000000,
            "completed_at": 0
        }
    
    def accept_mission(self, mission_id: int, user: str) -> Dict[str, Any]:
        """
        User accepts a mission
        
        Args:
            mission_id: Mission ID
            user: User address
            
        Returns:
            Transaction result
        """
        # Mock response
        return {
            "success": True,
            "tx_hash": "0xmock_accept_tx",
            "message": f"Mission {mission_id} accepted by {user}",
            "data": {
                "mission_id": mission_id,
                "status": "IN_PROGRESS",
                "assignee": user
            }
        }
    
    def complete_mission(self, mission_id: int, user: str, proof: str) -> Dict[str, Any]:
        """
        Mark mission as completed
        
        Args:
            mission_id: Mission ID
            user: User address
            proof: Proof URL/hash
            
        Returns:
            Transaction result
        """
        return {
            "success": True,
            "tx_hash": "0xmock_complete_tx",
            "message": f"Mission {mission_id} completed",
            "data": {
                "mission_id": mission_id,
                "status": "COMPLETED",
                "proof": proof
            }
        }
    
    def verify_mission(self, mission_id: int, verifier: str, approved: bool) -> Dict[str, Any]:
        """
        Verify completed mission
        
        Args:
            mission_id: Mission ID
            verifier: Verifier address
            approved: True to approve, False to reject
            
        Returns:
            Transaction result
        """
        return {
            "success": True,
            "tx_hash": "0xmock_verify_tx",
            "message": f"Mission {mission_id} {'approved' if approved else 'rejected'}",
            "data": {
                "mission_id": mission_id,
                "status": "VERIFIED" if approved else "IN_PROGRESS",
                "reward_distributed": approved
            }
        }
    
    def get_user_missions(self, user: str) -> List[int]:
        """
        Get list of user's missions
        
        Args:
            user: User address
            
        Returns:
            List of mission IDs
        """
        # Mock data
        return [1, 2, 3, 5, 7]
    
    def get_mission_count(self) -> int:
        """
        Get total number of missions
        
        Returns:
            Mission count
        """
        # Mock data
        return 42
    
    def get_blockchain_status(self) -> Dict[str, Any]:
        """
        Get NEO blockchain status
        
        Returns:
            Status information
        """
        try:
            block_count = self.get_block_count()
            balances = self.get_balance()
            
            return {
                "connected": True,
                "network": "NEO N3 TestNet",
                "block_height": block_count,
                "wallet_address": self.wallet_address,
                "balances": balances,
                "contract_address": self.mission_contract,
                "rpc_url": self.rpc_url
            }
        except Exception as e:
            return {
                "connected": False,
                "error": str(e),
                "network": "NEO N3 TestNet",
                "rpc_url": self.rpc_url
            }


# Singleton instance
neo_service = NeoService()
