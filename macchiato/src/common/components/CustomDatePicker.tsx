import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform, Modal, ScrollView } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

interface CustomDatePickerProps {
  visible: boolean;
  value: Date | null;
  maximumDate?: Date;
  onDateChange: (date: Date) => void;
  onCancel: () => void;
  title?: string;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  visible,
  value,
  maximumDate = new Date(),
  onDateChange,
  onCancel,
  title = 'Select Date'
}) => {
  const [tempDate, setTempDate] = useState<Date>(value || new Date());

  // Update tempDate when the component receives a new value
  React.useEffect(() => {
    if (value) {
      setTempDate(value);
    }
  }, [value, visible]);

  const confirmDateSelection = () => {
    onDateChange(tempDate);
  };

  // Custom date picker helpers
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const getCurrentYear = () => maximumDate.getFullYear();
  const getYearRange = () => {
    const currentYear = getCurrentYear();
    const years = [];
    for (let year = currentYear - 100; year <= currentYear; year++) {
      years.push(year);
    }
    return years.reverse();
  };

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const updateTempDate = (year: number, month: number, day: number) => {
    // Ensure the day is valid for the selected month/year
    const maxDays = getDaysInMonth(month, year);
    const validDay = Math.min(day, maxDays);
    const newDate = new Date(year, month, validDay);
    setTempDate(newDate);
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="flex-1 justify-center items-center bg-background-overlay">
        <View className="bg-background-secondary rounded-2xl p-6 m-6 w-80 max-w-full">
          {/* Modal Header */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-text-primary text-lg font-semibold">{title}</Text>
            <TouchableOpacity 
              onPress={onCancel}
              className="p-2"
            >
              <FontAwesomeIcon 
                icon={faTimes} 
                size={18} 
                color="#9FB3C8" 
              />
            </TouchableOpacity>
          </View>
          
          {/* Custom Date Picker for Android, Native for iOS */}
          <View className="items-center">
            {Platform.OS === 'ios' ? (
              <DateTimePicker
                testID="dateTimePicker"
                value={tempDate}
                mode="date"
                is24Hour={true}
                display="spinner"
                maximumDate={maximumDate}
                onChange={(event, selectedDate) => {
                  if (selectedDate) {
                    setTempDate(selectedDate);
                  }
                }}
                textColor="#FCFCFC"
                accentColor="#F8C825"
                themeVariant="dark"
                style={{
                  backgroundColor: 'transparent',
                  width: 280,
                }}
              />
            ) : (
              /* Custom Android Date Picker */
              <View className="w-full">
                {/* Year, Month, Day Selectors */}
                <View className="flex-row justify-between mb-4">
                  {/* Month Selector */}
                  <View className="flex-1 mr-2">
                    <Text className="text-text-secondary text-sm mb-2 text-center">Month</Text>
                    <View className="bg-background-tertiary rounded-lg">
                      <ScrollView 
                        style={{ height: 120 }}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingVertical: 10 }}
                      >
                        {months.map((month, index) => (
                          <TouchableOpacity
                            key={month}
                            onPress={() => updateTempDate(tempDate.getFullYear(), index, tempDate.getDate())}
                            className={`py-2 px-3 mx-2 rounded ${
                              tempDate.getMonth() === index ? 'bg-accent-500' : ''
                            }`}
                          >
                            <Text className={`text-center text-sm ${
                              tempDate.getMonth() === index ? 'text-text-inverse font-semibold' : 'text-text-primary'
                            }`}>
                              {month}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  </View>

                  {/* Day Selector */}
                  <View className="flex-1 mx-1">
                    <Text className="text-text-secondary text-sm mb-2 text-center">Day</Text>
                    <View className="bg-background-tertiary rounded-lg">
                      <ScrollView 
                        style={{ height: 120 }}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingVertical: 10 }}
                      >
                        {Array.from({ length: getDaysInMonth(tempDate.getMonth(), tempDate.getFullYear()) }, (_, i) => i + 1).map((day) => (
                          <TouchableOpacity
                            key={day}
                            onPress={() => updateTempDate(tempDate.getFullYear(), tempDate.getMonth(), day)}
                            className={`py-2 px-3 mx-2 rounded ${
                              tempDate.getDate() === day ? 'bg-accent-500' : ''
                            }`}
                          >
                            <Text className={`text-center text-sm ${
                              tempDate.getDate() === day ? 'text-text-inverse font-semibold' : 'text-text-primary'
                            }`}>
                              {day}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  </View>

                  {/* Year Selector */}
                  <View className="flex-1 ml-2">
                    <Text className="text-text-secondary text-sm mb-2 text-center">Year</Text>
                    <View className="bg-background-tertiary rounded-lg">
                      <ScrollView 
                        style={{ height: 120 }}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingVertical: 10 }}
                      >
                        {getYearRange().map((year) => (
                          <TouchableOpacity
                            key={year}
                            onPress={() => updateTempDate(year, tempDate.getMonth(), tempDate.getDate())}
                            className={`py-2 px-3 mx-2 rounded ${
                              tempDate.getFullYear() === year ? 'bg-accent-500' : ''
                            }`}
                          >
                            <Text className={`text-center text-sm ${
                              tempDate.getFullYear() === year ? 'text-text-inverse font-semibold' : 'text-text-primary'
                            }`}>
                              {year}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  </View>
                </View>

                {/* Selected Date Display */}
                <View className="bg-background-tertiary rounded-lg p-3 mb-4">
                  <Text className="text-text-primary text-center font-medium">
                    {formatDate(tempDate)}
                  </Text>
                </View>
              </View>
            )}
          </View>
          
          {/* Action Buttons */}
          <View className="flex-row justify-end mt-4 gap-3">
            <TouchableOpacity 
              onPress={onCancel}
              className="bg-background-tertiary rounded-lg px-4 py-2 flex-row items-center gap-2"
            >
              <FontAwesomeIcon 
                icon={faTimes} 
                size={14} 
                color="#9FB3C8" 
              />
              <Text className="text-text-secondary font-medium">Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={confirmDateSelection}
              className="bg-accent-500 rounded-lg px-4 py-2 flex-row items-center gap-2"
            >
              <FontAwesomeIcon 
                icon={faCheck} 
                size={14} 
                color="#171717" 
              />
              <Text className="text-text-inverse font-medium">Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomDatePicker;
