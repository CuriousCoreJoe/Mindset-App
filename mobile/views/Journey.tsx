import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Modal, StyleSheet, Alert, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { JournalEntry, Quote, SortOption, FilterOption } from '../types';
import { QUOTE_GENRES } from '../constants';
import { Plus, Trash2, Save, X, Filter, ArrowUpDown, Quote as QuoteIcon, Tag, Search } from 'lucide-react-native';

interface Props {
    initialQuote?: Quote | null;
    onClearInitialQuote: () => void;
    onEntrySaved?: () => void; // For gamification
}

export const Journey: React.FC<Props> = ({ initialQuote, onClearInitialQuote, onEntrySaved }) => {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [isEditing, setIsEditing] = useState(false);

    // Edit State
    const [editId, setEditId] = useState<string | null>(null);
    const [currentTitle, setCurrentTitle] = useState('');
    const [currentContent, setCurrentContent] = useState('');
    const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
    const [showPostSaveModal, setShowPostSaveModal] = useState(false);
    const [savedEntryId, setSavedEntryId] = useState<string | null>(null);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    // List View State
    const [sortBy, setSortBy] = useState<SortOption>('date_desc');
    const [filterBy, setFilterBy] = useState<FilterOption>('all');
    const [showFilters, setShowFilters] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const loadEntries = async () => {
            try {
                const saved = await AsyncStorage.getItem('mindset_journal');
                if (saved) {
                    setEntries(JSON.parse(saved));
                }
            } catch (e) { console.error("Failed to load journal", e); }
        };
        loadEntries();
    }, []);

    // Effect to handle incoming quote for new entry
    useEffect(() => {
        if (initialQuote) {
            startNewEntry();
            setCurrentQuote(initialQuote);
            onClearInitialQuote();
        }
    }, [initialQuote, onClearInitialQuote]);

    const startNewEntry = () => {
        setEditId(null);
        setCurrentTitle('');
        setCurrentContent('');
        setCurrentQuote(null);
        setSelectedTags([]);
        setIsEditing(true);
    };

    const openEntry = (entry: JournalEntry) => {
        setEditId(entry.id);
        setCurrentTitle(entry.title);
        setCurrentContent(entry.content);
        setCurrentQuote(entry.linkedQuote || null);
        setSelectedTags(entry.tags || []);
        setIsEditing(true);
    };

    const saveEntry = async () => {
        if (!currentContent.trim() && !currentTitle.trim()) return;

        const timestamp = Date.now();
        const entryId = editId || timestamp.toString();

        const newEntry: JournalEntry = {
            id: entryId,
            title: currentTitle.trim() || "Untitled Thought",
            content: currentContent,
            timestamp: editId ? entries.find(e => e.id === editId)?.timestamp || timestamp : timestamp,
            linkedQuote: currentQuote || undefined,
            tags: selectedTags,
        };

        let updated;
        if (editId) {
            updated = entries.map(e => e.id === editId ? newEntry : e);
        } else {
            updated = [newEntry, ...entries];
        }

        setEntries(updated);
        await AsyncStorage.setItem('mindset_journal', JSON.stringify(updated));

        // Notify parent for gamification if it's a NEW entry
        if (!editId && onEntrySaved) {
            onEntrySaved();
        }

        setSavedEntryId(entryId);
        setShowPostSaveModal(true);
    };

    const updateTags = async (tags: string[]) => {
        if (!savedEntryId) return;
        const updated = entries.map(e =>
            e.id === savedEntryId ? { ...e, tags } : e
        );
        setEntries(updated);
        await AsyncStorage.setItem('mindset_journal', JSON.stringify(updated));
        setShowPostSaveModal(false);
        setIsEditing(false);
    };

    const deleteEntry = async (id: string) => {
        Alert.alert(
            "Delete Entry",
            "Are you sure you want to delete this journal entry?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        const updated = entries.filter(e => e.id !== id);
                        setEntries(updated);
                        await AsyncStorage.setItem('mindset_journal', JSON.stringify(updated));
                    }
                }
            ]
        );
    };

    const getSortedAndFilteredEntries = () => {
        let result = [...entries];

        // Search
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(e =>
                e.title.toLowerCase().includes(q) ||
                e.content.toLowerCase().includes(q)
            );
        }

        // Filter
        if (filterBy !== 'all') {
            result = result.filter(e => e.tags?.includes(filterBy));
        }

        // Sort
        result.sort((a, b) => {
            if (sortBy === 'date_desc') return b.timestamp - a.timestamp;
            if (sortBy === 'date_asc') return a.timestamp - b.timestamp;
            if (sortBy === 'genre') return (a.tags?.[0] || '').localeCompare(b.tags?.[0] || '');
            return 0;
        });

        return result;
    };

    const filteredEntries = getSortedAndFilteredEntries();

    // --- EDIT MODE ---
    const renderEditor = () => (
        <Modal
            visible={isEditing}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={() => setIsEditing(false)}
        >
            <View style={styles.editorContainer}>
                {/* Editor Header */}
                <View style={styles.editorHeader}>
                    <TouchableOpacity onPress={() => setIsEditing(false)} style={styles.iconButton}>
                        <X size={24} color="#94a3b8" />
                    </TouchableOpacity>
                    <Text style={styles.editorTitle}>{editId ? 'Edit Entry' : 'New Entry'}</Text>
                    <TouchableOpacity onPress={saveEntry} style={styles.saveButton}>
                        <Save size={20} color="#020d08" />
                    </TouchableOpacity>
                </View>

                {/* Editor Content */}
                <ScrollView style={styles.editorContent} contentContainerStyle={{ paddingBottom: 100 }}>
                    <TextInput
                        placeholder="Title..."
                        placeholderTextColor="rgba(148, 163, 184, 0.4)"
                        value={currentTitle}
                        onChangeText={setCurrentTitle}
                        style={styles.titleInput}
                    />

                    {currentQuote && (
                        <View style={styles.quotePreview}>
                            <QuoteIcon size={18} color="#bfef00" style={{ marginTop: 4 }} />
                            <View style={{ flex: 1 }}>
                                <Text style={styles.quotePreviewText}>"{currentQuote.text}"</Text>
                                <Text style={styles.quotePreviewAuthor}>— {currentQuote.author}</Text>
                            </View>
                            <TouchableOpacity onPress={() => setCurrentQuote(null)} style={{ padding: 4 }}>
                                <X size={16} color="rgba(148, 163, 184, 0.5)" />
                            </TouchableOpacity>
                        </View>
                    )}

                    <TextInput
                        placeholder="Start writing..."
                        placeholderTextColor="rgba(148, 163, 184, 0.2)"
                        value={currentContent}
                        onChangeText={setCurrentContent}
                        multiline
                        style={styles.contentInput}
                        textAlignVertical="top"
                    />
                </ScrollView>

                {/* Post-Save Tagging Modal */}
                <Modal
                    visible={showPostSaveModal}
                    transparent={true}
                    animationType="fade"
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.tagModal}>
                            <Text style={styles.tagModalTitle}>Tag your memory</Text>
                            <Text style={styles.tagModalSubtitle}>Select topics to categorize this entry.</Text>

                            <View style={styles.tagsContainer}>
                                {QUOTE_GENRES.slice(0, 15).map(genre => (
                                    <TouchableOpacity
                                        key={genre}
                                        onPress={() => {
                                            if (selectedTags.includes(genre)) setSelectedTags(selectedTags.filter(t => t !== genre));
                                            else setSelectedTags([...selectedTags, genre]);
                                        }}
                                        style={[
                                            styles.tagChip,
                                            selectedTags.includes(genre) ? styles.tagChipSelected : styles.tagChipDefault
                                        ]}
                                    >
                                        <Text style={[
                                            styles.tagChipText,
                                            selectedTags.includes(genre) ? styles.tagChipTextSelected : styles.tagChipTextDefault
                                        ]}>{genre}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <View style={styles.tagModalActions}>
                                <TouchableOpacity onPress={() => updateTags(selectedTags)} style={styles.tagDoneButton}>
                                    <Text style={styles.tagDoneText}>Done</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => updateTags(selectedTags)} style={styles.tagSkipButton}>
                                    <Text style={styles.tagSkipText}>Skip</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        </Modal>
    );

    return (
        <View style={styles.container}>
            {renderEditor()}

            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Journal</Text>
                    <Text style={styles.subtitle}>{entries.length} entries</Text>
                </View>
                <View style={styles.headerActions}>
                    <TouchableOpacity
                        onPress={() => setShowFilters(!showFilters)}
                        style={[styles.iconButton, showFilters && styles.iconButtonActive]}
                    >
                        <Filter size={20} color={showFilters ? "#ffffff" : "#94a3b8"} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={startNewEntry}
                        style={styles.addButton}
                    >
                        <Plus size={24} color="#020d08" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Filters Drawer */}
            {showFilters && (
                <View style={styles.filtersDrawer}>
                    {/* Search Bar */}
                    <View style={styles.searchContainer}>
                        <Search size={16} color="#94a3b8" style={styles.searchIcon} />
                        <TextInput
                            placeholder="Search journals..."
                            placeholderTextColor="rgba(148, 163, 184, 0.5)"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            style={styles.searchInput}
                        />
                    </View>

                    <View style={styles.filterRow}>
                        <Text style={styles.filterLabel}>Sort By</Text>
                        <TouchableOpacity
                            onPress={() => setSortBy(prev => prev === 'date_desc' ? 'date_asc' : 'date_desc')}
                            style={styles.sortButton}
                        >
                            <ArrowUpDown size={12} color="#bfef00" />
                            <Text style={styles.sortButtonText}>
                                {sortBy === 'date_desc' ? 'Newest First' : 'Oldest First'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={[styles.filterLabel, { marginBottom: 8 }]}>Filter Tag</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tagsScroll}>
                        <TouchableOpacity
                            onPress={() => setFilterBy('all')}
                            style={[styles.filterChip, filterBy === 'all' ? styles.filterChipActive : styles.filterChipInactive]}
                        >
                            <Text style={filterBy === 'all' ? styles.filterChipTextActive : styles.filterChipTextInactive}>All</Text>
                        </TouchableOpacity>
                        {Array.from(new Set(entries.flatMap(e => e.tags || []))).map(tag => (
                            <TouchableOpacity
                                key={tag}
                                onPress={() => setFilterBy(tag)}
                                style={[styles.filterChip, filterBy === tag ? styles.filterChipActive : styles.filterChipInactive]}
                            >
                                <Text style={filterBy === tag ? styles.filterChipTextActive : styles.filterChipTextInactive}>{tag}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}

            {filteredEntries.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>Your journal is empty.</Text>
                    <TouchableOpacity onPress={startNewEntry}>
                        <Text style={styles.emptyStateLink}>Start writing</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={filteredEntries}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => openEntry(item)}
                            style={styles.entryCard}
                        >
                            <View style={styles.entryHeader}>
                                <View style={{ flex: 1, paddingRight: 16 }}>
                                    <Text style={styles.entryTitle} numberOfLines={1}>{item.title}</Text>
                                    <Text style={styles.entryDate}>
                                        {new Date(item.timestamp).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => deleteEntry(item.id)}
                                    style={styles.deleteButton}
                                >
                                    <Trash2 size={16} color="rgba(148, 163, 184, 0.3)" />
                                </TouchableOpacity>
                            </View>

                            {item.linkedQuote && (
                                <View style={styles.entryQuote}>
                                    <Text style={styles.entryQuoteText} numberOfLines={1}>"{item.linkedQuote.text}"</Text>
                                </View>
                            )}

                            <Text style={styles.entryPreview} numberOfLines={3}>
                                {item.content}
                            </Text>

                            {item.tags && item.tags.length > 0 && (
                                <View style={styles.entryTags}>
                                    {item.tags.map(tag => (
                                        <View key={tag} style={styles.entryTag}>
                                            <Tag size={10} color="#94a3b8" />
                                            <Text style={styles.entryTagText}>{tag}</Text>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#020d08',
        padding: 16,
        paddingBottom: 0, // FlatList handles bottom padding
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 24,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    subtitle: {
        color: '#94a3b8',
        fontSize: 14,
        marginTop: 4,
    },
    headerActions: {
        flexDirection: 'row',
        gap: 8,
    },
    iconButton: {
        padding: 12,
        borderRadius: 9999,
        backgroundColor: 'transparent',
    },
    iconButtonActive: {
        backgroundColor: '#1a2e26',
    },
    addButton: {
        backgroundColor: '#bfef00',
        padding: 12,
        borderRadius: 9999,
        shadowColor: '#bfef00',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    filtersDrawer: {
        marginBottom: 24,
        padding: 16,
        backgroundColor: '#1a2e26',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 16,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 8,
        color: '#ffffff',
        fontSize: 14,
    },
    filterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    filterLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    sortButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    sortButtonText: {
        fontSize: 12,
        color: '#bfef00',
    },
    tagsScroll: {
        gap: 8,
        paddingBottom: 4,
    },
    filterChip: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 9999,
    },
    filterChipActive: {
        backgroundColor: '#bfef00',
    },
    filterChipInactive: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    filterChipTextActive: {
        color: '#020d08',
        fontSize: 12,
    },
    filterChipTextInactive: {
        color: '#94a3b8',
        fontSize: 12,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 80,
        opacity: 0.5,
    },
    emptyStateText: {
        color: '#94a3b8',
        marginBottom: 16,
    },
    emptyStateLink: {
        color: '#bfef00',
        fontWeight: '500',
        textDecorationLine: 'underline',
    },
    listContent: {
        paddingBottom: 100,
        gap: 16,
    },
    entryCard: {
        backgroundColor: '#1a2e26',
        padding: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    entryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    entryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 4,
    },
    entryDate: {
        fontSize: 12,
        color: 'rgba(148, 163, 184, 0.5)',
        fontFamily: 'Courier', // Monospace-ish
    },
    deleteButton: {
        padding: 8,
    },
    entryQuote: {
        marginBottom: 12,
        paddingLeft: 12,
        borderLeftWidth: 2,
        borderLeftColor: 'rgba(191, 255, 0, 0.3)',
    },
    entryQuoteText: {
        fontSize: 12,
        color: '#94a3b8',
        fontStyle: 'italic',
    },
    entryPreview: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        lineHeight: 22,
        marginBottom: 12,
    },
    entryTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.05)',
    },
    entryTag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(2, 13, 8, 0.5)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    entryTagText: {
        fontSize: 10,
        color: '#94a3b8',
    },

    // Editor Styles
    editorContainer: {
        flex: 1,
        backgroundColor: '#020d08',
    },
    editorHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
        backgroundColor: '#020d08',
    },
    editorTitle: {
        fontSize: 18,
        fontWeight: '500',
        color: '#ffffff',
    },
    saveButton: {
        backgroundColor: '#bfef00',
        padding: 8,
        borderRadius: 9999,
    },
    editorContent: {
        flex: 1,
        padding: 24,
    },
    titleInput: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 24,
    },
    contentInput: {
        fontSize: 18,
        color: 'rgba(255, 255, 255, 0.9)',
        lineHeight: 28,
        minHeight: 200,
    },
    quotePreview: {
        backgroundColor: 'rgba(26, 46, 38, 0.5)',
        borderWidth: 1,
        borderColor: 'rgba(191, 255, 0, 0.2)',
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
        flexDirection: 'row',
        gap: 12,
        alignItems: 'flex-start',
    },
    quotePreviewText: {
        color: '#ffffff',
        fontStyle: 'italic',
        fontWeight: '300',
    },
    quotePreviewAuthor: {
        color: '#94a3b8',
        fontSize: 12,
        marginTop: 4,
    },

    // Tag Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    tagModal: {
        backgroundColor: '#1a2e26',
        borderRadius: 16,
        padding: 24,
        width: '100%',
        maxWidth: 380,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    tagModalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 8,
    },
    tagModalSubtitle: {
        fontSize: 14,
        color: '#94a3b8',
        marginBottom: 16,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        maxHeight: 240,
        marginBottom: 24,
    },
    tagChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 9999,
        borderWidth: 1,
    },
    tagChipSelected: {
        backgroundColor: '#bfef00',
        borderColor: '#bfef00',
    },
    tagChipDefault: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    tagChipText: {
        fontSize: 12,
    },
    tagChipTextSelected: {
        color: '#020d08',
    },
    tagChipTextDefault: {
        color: '#94a3b8',
    },
    tagModalActions: {
        flexDirection: 'row',
        gap: 12,
    },
    tagDoneButton: {
        flex: 1,
        backgroundColor: '#bfef00',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    tagDoneText: {
        color: '#020d08',
        fontWeight: 'bold',
    },
    tagSkipButton: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        alignItems: 'center',
    },
    tagSkipText: {
        color: '#94a3b8',
        fontWeight: '500',
    },
});
