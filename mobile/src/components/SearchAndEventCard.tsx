import React, { useState, useEffect } from 'react';
import { SafeAreaView, FlatList, StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import SearchBar from './SearchBar';
import EventCard from './EventCard';
import AppHelper from '@/helpers/WebHelper';
import Env from '@/config/Env';
import Icon from 'react-native-vector-icons/FontAwesome';
import { StartDateOption } from 'constants/StartDateOption';
import GlobalTheme from '@/styles/Global';

interface FilterOptions {
    tags: string;
    startDateOption: StartDateOption;
    customStartDate?: string | null;
    customEndDate?: string | null;
    notice: string;
}

interface SearchAndEventCardProps {
    page?: string;
    apiUrl: string;
    navigation: any;
}

function applyFilters(events: any[], filters?: FilterOptions): any[] {
    if (!filters) return events;
    let filtered = [...events];

    // Filter: Tags
    if (filters.tags) {
        const filterTags = filters.tags.split(',').map(tag => tag.trim()).filter(Boolean);
        if (filterTags.length > 0) {
            filtered = filtered.filter((evt: any) =>
                filterTags.every((filterTag: string) =>
                    evt.tags.some((t: string) => t.toLowerCase() === filterTag.toLowerCase())
                )
            );
        }
    }

    // Filter: Date
    if (filters.startDateOption) {
        const option = filters.startDateOption;
        const now = new Date();
        switch (option) {
            case "Upcoming": {
                filtered = filtered.filter((evt: any) =>
                    evt.session.some((sess: any) => new Date(sess.startDate) >= now)
                );
                break;
            }
            case "Today": {
                const start = new Date(); start.setHours(0, 0, 0, 0);
                const end = new Date(); end.setHours(23, 59, 59, 999);
                filtered = filtered.filter((evt: any) =>
                    evt.session.some((sess: any) => {
                        const d = new Date(sess.startDate);
                        return d >= start && d <= end;
                    })
                );
                break;
            }
            case "Tomorrow": {
                const t = new Date(); t.setDate(t.getDate() + 1);
                const start = new Date(t); start.setHours(0, 0, 0, 0);
                const end = new Date(t); end.setHours(23, 59, 59, 999);
                filtered = filtered.filter((evt: any) =>
                    evt.session.some((sess: any) => {
                        const d = new Date(sess.startDate);
                        return d >= start && d <= end;
                    })
                );
                break;
            }
            case "This Week": {
                const currentDay = now.getDay();
                const monday = new Date(now);
                monday.setDate(now.getDate() - (currentDay === 0 ? 6 : currentDay - 1));
                monday.setHours(0, 0, 0, 0);
                const sunday = new Date(monday);
                sunday.setDate(monday.getDate() + 6);
                sunday.setHours(23, 59, 59, 999);
                filtered = filtered.filter((evt: any) =>
                    evt.session.some((sess: any) => {
                        const d = new Date(sess.startDate);
                        return d >= monday && d <= sunday;
                    })
                );
                break;
            }
            case "Next Week": {
                const currentDay = now.getDay();
                const nextMonday = new Date(now);
                nextMonday.setDate(now.getDate() + (currentDay === 0 ? 1 : 8 - currentDay));
                nextMonday.setHours(0, 0, 0, 0);
                const nextSunday = new Date(nextMonday);
                nextSunday.setDate(nextMonday.getDate() + 6);
                nextSunday.setHours(23, 59, 59, 999);
                filtered = filtered.filter((evt: any) =>
                    evt.session.some((sess: any) => {
                        const d = new Date(sess.startDate);
                        return d >= nextMonday && d <= nextSunday;
                    })
                );
                break;
            }
            case "Choose Date": {
                if (filters.customStartDate && filters.customEndDate) {
                    const start = new Date(filters.customStartDate);
                    const end = new Date(filters.customEndDate);
                    filtered = filtered.filter((evt: any) =>
                        evt.session.some((sess: any) => {
                            const d = new Date(sess.startDate);
                            return d >= start && d <= end;
                        })
                    );
                }
                break;
            }
        }
    }

    // Filter: Notice
    if (filters.notice) {
        const filterNotices = filters.notice.split(',').map((n: string) => n.trim()).filter(Boolean);
        if (filterNotices.length > 0) {
            filtered = filtered.filter((evt: any) =>
                filterNotices.every((option: string) => evt.notice?.[option] === true)
            );
        }
    }
    return filtered;
}

const SearchAndEventCard: React.FC<SearchAndEventCardProps> = ({ page, apiUrl, navigation }) => {
    const [events, setEvents] = useState<any[]>([]);
    const [query, setQuery] = useState<string>('');

    // Batch Delete（Only Used in Favorite Page）
    const [batchMode, setBatchMode] = useState(false);
    const [selectedFavorites, setSelectedFavorites] = useState<string[]>([]);

    // Fetch Data (Event, Favorite, UserEvent)
    const fetchEvents = async (searchQuery: string = '', filters?: FilterOptions) => {
        try {
            const response = await fetch(AppHelper.joinUrl(Env.API_BASE_URL, apiUrl));
            const data = await response.json();

            let filtered = data;
            if (page === "Event") {
                filtered = applyFilters(filtered, filters);

                filtered = searchQuery
                    ? filtered.filter((evt: any) =>
                        evt.name.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    : filtered;

                setEvents(filtered);
            }
            else { // Favorite, User Event
                const filteredData = data.filter((item: any) => {
                    const [event] = [item.event];
                    const filteredEvents = applyFilters([event], filters);

                    return searchQuery
                        ? filteredEvents.some((e: any) =>
                            e.name.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        : filteredEvents.length > 0;
                });
                setEvents(filteredData);
            }
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const handleSearch = (searchQuery: string, filters?: FilterOptions) => {
        setQuery(searchQuery);
        fetchEvents(searchQuery, filters);
    };

    // Favorite: Batch Delete
    const handleBatchDelete = async () => {
        if (selectedFavorites.length === 0) {
            Alert.alert('No selection', 'Please select favorites to delete.');
            return;
        }
        try {
            const response = await fetch(AppHelper.joinUrl(Env.API_BASE_URL, '/favorites'), {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ favoriteIDs: selectedFavorites }),
            });
            const result = await response.json();
            if (response.ok) {
                Alert.alert('Success', result.message);
                fetchEvents(query);
                setSelectedFavorites([]);
                setBatchMode(false);
            } else {
                Alert.alert('Error', result.message || 'Failed to delete favorites.');
            }
        } catch (error) {
            console.error('Batch delete error:', error);
            Alert.alert('Error', 'Failed to delete favorites.');
        }
    };

    // Favorite: Change favorite choose / cancel status
    const toggleFavoriteSelect = (favoriteID: string) => {
        setSelectedFavorites(prev =>
            prev.includes(favoriteID)
                ? prev.filter(id => id !== favoriteID)
                : [...prev, favoriteID]
        );
    };

    // Render   
    const renderItem = ({ item }: { item: any }) => {
        if (page === "Favorite") {
            const onPressHandler = () => {
                if (batchMode) {
                    toggleFavoriteSelect(item.favoriteID);
                } else {
                    navigation.navigate('Events', {
                        screen: 'EventDetail',
                        params: { event: item.event }
                    });
                }
            };
            return (
                <TouchableOpacity
                    onPress={onPressHandler}
                    onLongPress={() => batchMode ? toggleFavoriteSelect(item.favoriteID) : null}
                    style={[
                        styles.eventCardWrapper,
                        batchMode && selectedFavorites.includes(item.favoriteID) && styles.selectedCard,
                    ]}
                >
                    <EventCard event={item.event} onPress={onPressHandler} />
                </TouchableOpacity>
            );
        }
        else if (page === "Event") {
            return (
                <EventCard
                    event={item}
                    onPress={() => navigation.navigate('EventDetail', { event: item })}
                />
            );
        }
        else if (page === "UserEvent") {
            return (
                <EventCard
                    event={item.event}
                    onPress={() => navigation.navigate('UserEventDetail', { event: item })}
                />
            );
        }
        return null;
    };

    useFocusEffect(
        React.useCallback(() => {
          fetchEvents(query); // Refresh the page when user click Event, UserEvent, Favorite
        }, [query])
    );

    useEffect(() => {
        fetchEvents(query);
    }, [query]);

    return (
        <SafeAreaView style={styles.container}>
            {/* Search Bar */}
            <SearchBar onSearch={handleSearch} />

            {/* Favorite Only: Batch Delete, Trash icon */}
            {page === "Favorite" && (
                <View style={styles.header}>
                    {batchMode ? (
                        <>
                            <TouchableOpacity onPress={() => { setBatchMode(false); setSelectedFavorites([]); }}>
                                <Icon name="close" size={24} color={GlobalTheme.primary} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleBatchDelete} style={{ marginLeft: 20 }}>
                                <Icon name="trash" size={24} color={GlobalTheme.danger} />
                            </TouchableOpacity>
                        </>
                    ) : (
                        <TouchableOpacity onPress={() => setBatchMode(true)}>
                            <Icon name="trash" size={24} color={GlobalTheme.danger} style={{ marginRight: 10 }} />
                        </TouchableOpacity>
                    )}
                </View>
            )}

            {/* Event Card */}
            <FlatList
                data={events}
                keyExtractor={(item) => (page === "Favorite" ? item.favoriteID : item.id)}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: GlobalTheme.white,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    listContainer: {
        paddingBottom: 20,
    },
    eventCardWrapper: {
        marginVertical: 5,
    },
    selectedCard: {
        borderWidth: 2,
        borderColor: GlobalTheme.primary,
        borderRadius: 8,
    },
});

export default SearchAndEventCard;
