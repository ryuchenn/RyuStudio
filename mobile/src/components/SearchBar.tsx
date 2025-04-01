import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Platform, UIManager, LayoutAnimation, Modal, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import tagList from 'constants/TagList'; 
import tagColors from 'constants/TagColors';
import { StartDateOption } from 'constants/StartDateOption';
import noticeOptions from 'constants/Notice';
import GlobalTheme from '@/styles/Global';

// At the bottom of Search Bar, not included "Choose Date"
const scrollBarStartDateOptions: Exclude<StartDateOption, "Choose Date">[] = ["Upcoming", "Today", "Tomorrow", "This Week", "Next Week"];

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface SearchBarProps {
  onSearch: (query: string, filters?: { 
    tags: string; 
    startDateOption: StartDateOption;
    customStartDate?: string | null;
    customEndDate?: string | null;
    notice: string;
  }) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedNotices, setSelectedNotices] = useState<string[]>([]);
  
  // Default option: "Upcoming"
  const [startDateOption, setStartDateOption] = useState<StartDateOption>("Upcoming");
  
  // "Choose Date" Only in modal. StartDate & EndDate
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);
  
  // Control Modal Expand
  const [startDateExpanded, setStartDateExpanded] = useState(false);
  const [noticeExpanded, setNoticeExpanded] = useState(false);
  const [tagsExpanded, setTagsExpanded] = useState(false);
  const [customDateExpanded, setCustomDateExpanded] = useState(false);

  const handleSubmitEditing = () => {
    onSearch(query, { 
      tags: selectedTags.join(','), 
      startDateOption,
      customStartDate: startDateOption === "Choose Date" && customStartDate ? customStartDate.toISOString().split('T')[0] : null,
      customEndDate: startDateOption === "Choose Date" && customEndDate ? customEndDate.toISOString().split('T')[0] : null,
      notice: selectedNotices.join(',')
    });
  };

  // Click Modal to open or close  
  const toggleFilter = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setFilterVisible(!filterVisible);
  };

  // Clear
  const clearSearch = () => {
    setQuery('');
    onSearch(''); 
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setSelectedNotices([]);
    setStartDateOption("Upcoming");
    setCustomStartDate(null);
    setCustomEndDate(null);
  };

  // Cancel: Only close modal. Not change the filter result.
  const cancelFilters = () => {
    toggleFilter();
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const toggleNotice = (notice: string) => {
    if (selectedNotices.includes(notice)) {
      setSelectedNotices(selectedNotices.filter(n => n !== notice));
    } else {
      setSelectedNotices([...selectedNotices, notice]);
    }
  };

  // When the user click date options(Under search bar component). It will immediately search. 
  const onSelectStartDateOption = (option: StartDateOption) => {
    setStartDateOption(option);
    onSearch(query, { 
      tags: selectedTags.join(','), 
      startDateOption: option,
      customStartDate: option === "Choose Date" && customStartDate ? customStartDate.toISOString().split('T')[0] : null,
      customEndDate: option === "Choose Date" && customEndDate ? customEndDate.toISOString().split('T')[0] : null,
      notice: selectedNotices.join(',')
    });
  };

  return (
    <View style={styles.wrapper}>

      {/* Search Bar component */}
      <View style={styles.container}>
        <Icon name="search" size={20} style={styles.iconLeft} />
        <TextInput
          placeholder="Search Events"
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSubmitEditing}
          returnKeyType="search"
        />
        
        {/* It will display "X" button when user type the word at the search bar */}
        {query.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearTextButton}>
            <Icon name="times" size={18} color="#666" />
          </TouchableOpacity>
        )}

        {/* Filter button at search bar */}
        <TouchableOpacity onPress={toggleFilter}>
          <Icon2 name="filter" size={20} style={styles.iconRight} />
        </TouchableOpacity>
      </View>
      
      {/* Start Date Bar at the bottom of Search Bar (NOT included Choose Date) */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.startDateBar}
      >
        {scrollBarStartDateOptions.map((option) => {
          const isSelected = startDateOption === option;
          return (
            <TouchableOpacity 
              key={option} 
              style={[styles.startDateOption, isSelected && styles.startDateOptionSelected]}
              onPress={() => onSelectStartDateOption(option)}
            >
              <Text style={[styles.startDateOptionText, isSelected && styles.startDateOptionTextSelected]}>
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      
      {/* Filter Modal */}
      <Modal
        visible={filterVisible}
        animationType="slide"
        transparent
        onRequestClose={toggleFilter}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={toggleFilter}>
          <View style={styles.sheetContainer}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Filter Options</Text>
              <View style={styles.headerButtons}>
                <TouchableOpacity onPress={cancelFilters} style={styles.cancelButton}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={clearFilters} style={styles.clearButton}>
                  <Text style={styles.clearButtonText}>Clear</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Date（Included "Choose Date" Option at here） */}
            <ScrollView style={styles.sheetContent}>
              <TouchableOpacity 
                onPress={() => setStartDateExpanded(!startDateExpanded)} 
                style={styles.sectionHeader}
              >
                <Text style={styles.sectionTitle}>Date</Text>
                <Icon name={startDateExpanded ? "chevron-up" : "chevron-down"} size={16} />
              </TouchableOpacity>
              {startDateExpanded && (
                <View style={styles.optionsContainer}>
                  {["Upcoming", "Today", "Tomorrow", "This Week", "Next Week", "Choose Date"].map((option) => {
                    const isSelected = startDateOption === option;
                    return (
                      <TouchableOpacity
                        key={option}
                        onPress={() => setStartDateOption(option as StartDateOption)}
                        style={[
                          styles.optionButton,
                          isSelected && styles.optionButtonSelected,
                        ]}
                      >
                        <Text style={[styles.optionTextNotSelected, isSelected && styles.optionText,]}>{option}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
              {startDateOption === "Choose Date" && (
                <>
                  <TouchableOpacity 
                    onPress={() => setCustomDateExpanded(!customDateExpanded)}
                    style={styles.sectionHeader}
                  >
                    <Text style={styles.sectionTitle}>Custom Date Range</Text>
                    <Icon name={customDateExpanded ? "chevron-up" : "chevron-down"} size={16} />
                  </TouchableOpacity>
                  {customDateExpanded && (
                    <View style={styles.customDateContainer}>
                      <Text style={styles.dateLabel}>Start:</Text>
                      <DateTimePicker
                        value={customStartDate || new Date()}
                        mode="date"
                        display="default"
                        onChange={(event, date) => {
                          if (date) {
                            setCustomStartDate(date);
                          }
                        }}
                        style={styles.datePicker}
                      />
                      <Text style={styles.dateLabel}>End:</Text>
                      <DateTimePicker
                        value={customEndDate || new Date()}
                        mode="date"
                        display="default"
                        onChange={(event, date) => {
                          if (date) {
                            setCustomEndDate(date);
                          }
                        }}
                        style={styles.datePicker}
                      />
                    </View>
                  )}
                </>
              )}

              {/* Notice (Info) */}
              <TouchableOpacity 
                onPress={() => setNoticeExpanded(!noticeExpanded)} 
                style={styles.sectionHeader}
              >
                <Text style={styles.sectionTitle}>Info</Text>
                <Icon name={noticeExpanded ? "chevron-up" : "chevron-down"} size={16} />
              </TouchableOpacity>
              {noticeExpanded && (
                <View style={styles.noticeContainer}>
                  {noticeOptions.map((notice, index) => {
                    const backgroundColor = tagColors[index % tagColors.length];
                    const isSelected = selectedNotices.includes(notice);
                    return (
                      <TouchableOpacity
                        key={notice}
                        onPress={() => toggleNotice(notice)}
                        style={[
                          styles.noticeButton,
                          { backgroundColor },
                          isSelected && styles.noticeButtonSelected,
                        ]}
                      >
                        <Text style={styles.noticeText}>{notice.charAt(0).toUpperCase() + notice.slice(1).toLowerCase()}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}

              {/* Tags */}
              <TouchableOpacity 
                onPress={() => setTagsExpanded(!tagsExpanded)} 
                style={styles.sectionHeader}
              >
                <Text style={styles.sectionTitle}>Tags</Text>
                <Icon name={tagsExpanded ? "chevron-up" : "chevron-down"} size={16} />
              </TouchableOpacity>
              {tagsExpanded && (
                <View style={styles.tagsContainer}>
                  {tagList.map((tag, index) => {
                    const backgroundColor = tagColors[index % tagColors.length];
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <TouchableOpacity
                        key={tag}
                        onPress={() => toggleTag(tag)}
                        style={[
                          styles.tagButton,
                          { backgroundColor },
                          isSelected && styles.tagButtonSelected,
                        ]}
                      >
                        <Text style={styles.tagText}>{tag}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </ScrollView>

            {/* Search button at the bottom */}
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => {
                onSearch(query, {
                  tags: selectedTags.join(','),
                  startDateOption,
                  customStartDate: startDateOption === "Choose Date" && customStartDate ? customStartDate.toISOString().split('T')[0] : null,
                  customEndDate: startDateOption === "Choose Date" && customEndDate ? customEndDate.toISOString().split('T')[0] : null,
                  notice: selectedNotices.join(',')
                });
                toggleFilter();
              }}
            >
              <Icon name="search" size={16} style={styles.applyIcon} />
              <Text style={styles.applyButtonText}>Search</Text>
            </TouchableOpacity>

          </View>
        </TouchableOpacity>
      </Modal>
      
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 10,
    marginTop: 10,
  },
  container: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    borderColor: GlobalTheme.gray1,
    borderWidth: 2,
    borderRadius: 16,
    backgroundColor: GlobalTheme.white,
  },
  iconLeft: {
    marginRight: 8,
    color: GlobalTheme.gray3,
  },
  input: {
    flex: 1,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  iconRight: {
    marginLeft: 8,
    color: GlobalTheme.gray3,
  },
  clearTextButton: {
    padding: 4,
    marginLeft: 4,
  },
  startDateBar: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 6,
    paddingHorizontal: 5,
  },
  startDateOption: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: GlobalTheme.gray1,
    marginRight: 8,
  },
  startDateOptionSelected: {
    backgroundColor: GlobalTheme.primary,
    borderColor: GlobalTheme.lightGray,
  },
  startDateOptionText: {
    fontSize: 14,
    color: GlobalTheme.gray4,
  },
  startDateOptionTextSelected: {
    fontWeight: 'bold',
    color: GlobalTheme.white,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: GlobalTheme.gray2,
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    height: '90%',
    backgroundColor: GlobalTheme.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    justifyContent: 'space-between',
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  clearButton: {
    backgroundColor: GlobalTheme.danger,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  clearButtonText: {
    color: GlobalTheme.white,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: GlobalTheme.gray2,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginRight: 10,
  },
  cancelButtonText: {
    color: GlobalTheme.white,
    fontWeight: 'bold',
  },
  sheetContent: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: GlobalTheme.gray1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  optionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: GlobalTheme.gray1,
    marginRight: 8,
    marginBottom: 8,
  },
  optionButtonSelected: {
    backgroundColor: GlobalTheme.primary,
    borderColor: GlobalTheme.lightGray,
  },
  optionText: {
    color: GlobalTheme.white,
  },
  optionTextNotSelected: {
    color: GlobalTheme.gray4,
  },
  customDateContainer: {
    marginVertical: 10,
  },
  dateLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  datePicker: {
    width: '100%',
  },
  noticeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  noticeButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: GlobalTheme.gray1,
    marginRight: 8,
    marginBottom: 8,
  },
  noticeButtonSelected: {
    borderWidth: 2,
    borderColor: GlobalTheme.black,
  },
  noticeText: {
    color: GlobalTheme.gray4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  tagButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagButtonSelected: {
    borderWidth: 2,
    borderColor: GlobalTheme.black,
  },
  tagText: {
    color: GlobalTheme.gray4,
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: GlobalTheme.primary,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  applyIcon: {
    marginRight: 8,
    color: GlobalTheme.white,
  },
  applyButtonText: {
    color: GlobalTheme.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SearchBar;
