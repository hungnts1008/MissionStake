import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar, Clock, Plus, Trash2, Save } from 'lucide-react';
import { UserSchedule, TaskCategory } from '../types/ai-types';

type Props = {
  onSave: (schedule: UserSchedule[]) => void;
  onCancel: () => void;
};

const daysOfWeek = [
  { value: 0, label: 'Chủ nhật' },
  { value: 1, label: 'Thứ 2' },
  { value: 2, label: 'Thứ 3' },
  { value: 3, label: 'Thứ 4' },
  { value: 4, label: 'Thứ 5' },
  { value: 5, label: 'Thứ 6' },
  { value: 6, label: 'Thứ 7' },
];

const categories: TaskCategory[] = [
  'đời sống',
  'học tập',
  'thể thao',
  'sức khỏe',
  'tài chính',
  'sáng tạo',
  'công việc',
  'xã hội',
];

export function ScheduleManager({ onSave, onCancel }: Props) {
  const [schedules, setSchedules] = useState<UserSchedule[]>([
    {
      dayOfWeek: 1,
      timeSlots: [],
      preferences: {
        preferredCategories: [],
        availableTime: 60,
      },
    },
  ]);

  const addDay = () => {
    setSchedules([
      ...schedules,
      {
        dayOfWeek: schedules.length,
        timeSlots: [],
        preferences: {
          preferredCategories: [],
          availableTime: 60,
        },
      },
    ]);
  };

  const removeDay = (index: number) => {
    setSchedules(schedules.filter((_, i) => i !== index));
  };

  const addTimeSlot = (dayIndex: number) => {
    const newSchedules = [...schedules];
    newSchedules[dayIndex].timeSlots.push({
      start: '09:00',
      end: '10:00',
      activity: '',
    });
    setSchedules(newSchedules);
  };

  const removeTimeSlot = (dayIndex: number, slotIndex: number) => {
    const newSchedules = [...schedules];
    newSchedules[dayIndex].timeSlots = newSchedules[dayIndex].timeSlots.filter(
      (_, i) => i !== slotIndex
    );
    setSchedules(newSchedules);
  };

  const updateTimeSlot = (
    dayIndex: number,
    slotIndex: number,
    field: 'start' | 'end' | 'activity',
    value: string
  ) => {
    const newSchedules = [...schedules];
    newSchedules[dayIndex].timeSlots[slotIndex][field] = value;
    setSchedules(newSchedules);
  };

  const updateDayOfWeek = (index: number, day: number) => {
    const newSchedules = [...schedules];
    newSchedules[index].dayOfWeek = day;
    setSchedules(newSchedules);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Quản lý Lịch trình</h2>
          <p className="text-gray-500">
            Thiết lập lịch trình hàng tuần để AI có thể đề xuất nhiệm vụ phù hợp
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Hủy
          </Button>
          <Button onClick={() => onSave(schedules)}>
            <Save size={16} className="mr-2" />
            Lưu lịch trình
          </Button>
        </div>
      </div>

      {/* Schedule Cards */}
      <div className="space-y-4">
        {schedules.map((schedule, dayIndex) => (
          <Card key={dayIndex} className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="text-indigo-600" size={24} />
                  <div>
                    <CardTitle>
                      <Select
                        value={schedule.dayOfWeek.toString()}
                        onValueChange={(value: string) =>
                          updateDayOfWeek(dayIndex, parseInt(value))
                        }
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {daysOfWeek.map((day) => (
                            <SelectItem key={day.value} value={day.value.toString()}>
                              {day.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </CardTitle>
                    <CardDescription>
                      {schedule.timeSlots.length} khung giờ đã thiết lập
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeDay(dayIndex)}
                  disabled={schedules.length === 1}
                >
                  <Trash2 size={16} className="text-red-500" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Time Slots */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold">Khung giờ bận</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addTimeSlot(dayIndex)}
                  >
                    <Plus size={14} className="mr-1" />
                    Thêm khung giờ
                  </Button>
                </div>

                {schedule.timeSlots.map((slot, slotIndex) => (
                  <div
                    key={slotIndex}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <Clock size={16} className="text-gray-400" />
                    
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={slot.start}
                        onChange={(e) =>
                          updateTimeSlot(dayIndex, slotIndex, 'start', e.target.value)
                        }
                        className="w-32"
                      />
                      <span className="text-gray-400">-</span>
                      <Input
                        type="time"
                        value={slot.end}
                        onChange={(e) =>
                          updateTimeSlot(dayIndex, slotIndex, 'end', e.target.value)
                        }
                        className="w-32"
                      />
                    </div>

                    <Input
                      placeholder="Hoạt động (vd: Làm việc, Học...)"
                      value={slot.activity || ''}
                      onChange={(e) =>
                        updateTimeSlot(dayIndex, slotIndex, 'activity', e.target.value)
                      }
                      className="flex-1"
                    />

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTimeSlot(dayIndex, slotIndex)}
                    >
                      <Trash2 size={14} className="text-red-500" />
                    </Button>
                  </div>
                ))}

                {schedule.timeSlots.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-4">
                    Chưa có khung giờ nào. Nhấn "Thêm khung giờ" để bắt đầu.
                  </p>
                )}
              </div>

              {/* Available Time */}
              <div className="pt-4 border-t">
                <Label className="text-sm font-semibold mb-2 block">
                  Thời gian rảnh trong ngày (phút)
                </Label>
                <Input
                  type="number"
                  min="0"
                  value={schedule.preferences?.availableTime || 60}
                  onChange={(e) => {
                    const newSchedules = [...schedules];
                    if (newSchedules[dayIndex].preferences) {
                      newSchedules[dayIndex].preferences!.availableTime = parseInt(
                        e.target.value
                      );
                      setSchedules(newSchedules);
                    }
                  }}
                  className="w-32"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button variant="outline" onClick={addDay} className="w-full">
        <Plus size={16} className="mr-2" />
        Thêm ngày mới
      </Button>
    </div>
  );
}
