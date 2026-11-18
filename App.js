import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';

export default function App() {
  // Form input states
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('Starter'); // Default selection
  const [price, setPrice] = useState('');

  // Main data state
  const [menuItems, setMenuItems] = useState([]);

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  // Feedback messages
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // 1. Add or Update Menu Item
  const handleSaveMenuItem = () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (!dishName.trim() || !description.trim() || !course.trim() || !price.trim()) {
      setErrorMessage('All fields are required. Please fill in all details.');
      return;
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setErrorMessage('Please enter a valid positive number for the price.');
      return;
    }

    if (isEditing) {
      // Update existing item
      setMenuItems(
        menuItems.map((item) =>
          item.id === editId
            ? { ...item, name: dishName, description, course, price: parsedPrice.toFixed(2) }
            : item
        )
      );
      setSuccessMessage(`Successfully updated "${dishName}"!`);
      setIsEditing(false);
      setEditId(null);
    } else {
      // Add new item
      const newItem = {
        id: Date.now().toString(),
        name: dishName,
        description,
        course,
        price: parsedPrice.toFixed(2),
      };
      setMenuItems([...menuItems, newItem]);
      setSuccessMessage(`Successfully added "${dishName}" to the menu!`);
    }

    // Reset form fields
    setDishName('');
    setDescription('');
    setCourse('Starter');
    setPrice('');
  };

  // 2. Edit Menu Item (Load into form)
  const handleEdit = (item) => {
    setIsEditing(true);
    setEditId(item.id);
    setDishName(item.name);
    setDescription(item.description);
    setCourse(item.course);
    setPrice(item.price);
    setErrorMessage('');
    setSuccessMessage('');
  };

  // 3. Delete Menu Item
  const handleDelete = (id) => {
    setMenuItems(menuItems.filter((item) => item.id !== id));
    setSuccessMessage('Menu item deleted successfully.');
    if (isEditing && editId === id) {
      // Cancel edit mode if the item being edited is deleted
      setIsEditing(false);
      setDishName('');
      setDescription('');
      setCourse('Starter');
      setPrice('');
    }
  };

  // 4. Filtering and Searching logic
  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'All' || item.course === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  // 5. Menu Statistics calculations
  const totalItems = menuItems.length;
  const averagePrice = totalItems > 0 
    ? (menuItems.reduce((sum, item) => sum + parseFloat(item.price), 0) / totalItems).toFixed(2) 
    : '0.00';
  
  const startersCount = menuItems.filter(item => item.course === 'Starter').length;
  const mainsCount = menuItems.filter(item => item.course === 'Main Course').length;
  const dessertsCount = menuItems.filter(item => item.course === 'Dessert').length;

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Application Title */}
        <Text style={styles.headerTitle}>Chef's Menu Manager</Text>
        <Text style={styles.subtitle}>Final Portfolio of Evidence</Text>

        {/* STATISTICS DASHBOARD */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Menu Statistics</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{totalItems}</Text>
              <Text style={styles.statLabel}>Total Items</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>R {averagePrice}</Text>
              <Text style={styles.statLabel}>Avg Price</Text>
            </View>
          </View>
          <View style={styles.courseStatsRow}>
            <Text style={styles.courseStatText}>Starters: {startersCount}</Text>
            <Text style={styles.courseStatText}>Mains: {mainsCount}</Text>
            <Text style={styles.courseStatText}>Desserts: {dessertsCount}</Text>
          </View>
        </View>

        {/* ADD / EDIT FORM CONTAINER */}
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>
            {isEditing ? 'Edit Menu Item' : 'Add New Menu Item'}
          </Text>

          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
          {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}

          <Text style={styles.label}>Dish Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Bobotie"
            placeholderTextColor="#888"
            value={dishName}
            onChangeText={setDishName}
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="e.g., Spiced minced meat baked with an egg-based topping"
            placeholderTextColor="#888"
            multiline={true}
            numberOfLines={3}
            value={description}
            onChangeText={setDescription}
          />

          <Text style={styles.label}>Course (Starter, Main Course, Dessert)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Main Course"
            placeholderTextColor="#888"
            value={course}
            onChangeText={setCourse}
          />

          <Text style={styles.label}>Price (R)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 145.00"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />

          <TouchableOpacity style={styles.addButton} onPress={handleSaveMenuItem}>
            <Text style={styles.addButtonText}>
              {isEditing ? 'Update Menu Item' : 'Save Menu Item'}
            </Text>
          </TouchableOpacity>

          {isEditing && (
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={() => {
                setIsEditing(false);
                setDishName('');
                setDescription('');
                setCourse('Starter');
                setPrice('');
                setErrorMessage('');
                setSuccessMessage('');
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* SEARCH AND FILTER SECTION */}
        <View style={styles.filterContainer}>
          <Text style={styles.sectionTitle}>Search & Filter</Text>
          <TextInput
            style={styles.input}
            placeholder="Search dish by name..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterButtonsRow}>
            {['All', 'Starter', 'Main Course', 'Dessert'].map((filterOption) => (
              <TouchableOpacity
                key={filterOption}
                style={[
                  styles.filterChip,
                  selectedFilter === filterOption && styles.activeFilterChip
                ]}
                onPress={() => setSelectedFilter(filterOption)}
              >
                <Text style={[
                  styles.filterChipText,
                  selectedFilter === filterOption && styles.activeFilterChipText
                ]}>
                  {filterOption}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* DISPLAY MENU ITEMS SECTION */}
        <View style={styles.listContainer}>
          <Text style={styles.sectionTitle}>
            Menu Items ({filteredItems.length})
          </Text>

          {filteredItems.length === 0 ? (
            <Text style={styles.emptyText}>No matching menu items found.</Text>
          ) : (
            <FlatList
              data={filteredItems}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{item.name}</Text>
                    <Text style={styles.cardPrice}>R {item.price}</Text>
                  </View>
                  <Text style={styles.cardCourse}>Course: {item.course}</Text>
                  <Text style={styles.cardDescription}>{item.description}</Text>
                  
                  {/* Action Buttons for Edit & Delete */}
                  <View style={styles.cardActionRow}>
                    <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}>
                      <Text style={styles.actionButtonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
                      <Text style={styles.actionButtonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  scrollContainer: {
    padding: 20,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 20,
  },
  statsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  courseStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    paddingTop: 10,
  },
  courseStatText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#34495e',
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    elevation: 3,
    marginBottom: 20,
  },
  filterContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    elevation: 2,
    marginBottom: 20,
  },
  filterButtonsRow: {
    flexDirection: 'row',
    marginTop: 5,
  },
  filterChip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#f1f2f6',
    borderRadius: 20,
    marginRight: 8,
  },
  activeFilterChip: {
    backgroundColor: '#3498db',
  },
  filterChipText: {
    fontSize: 12,
    color: '#2c3e50',
    fontWeight: '600',
  },
  activeFilterChipText: {
    color: '#ffffff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34495e',
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#dcdde1',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#f8f9fa',
    marginBottom: 15,
    color: '#2c3e50',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  addButton: {
    backgroundColor: '#27ae60',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 5,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#95a5a6',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#e74c3c',
    backgroundColor: '#fadbd8',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 14,
    textAlign: 'center',
  },
  successText: {
    color: '#27ae60',
    backgroundColor: '#d4efdf',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 14,
    textAlign: 'center',
  },
  listContainer: {
    marginTop: 5,
  },
  emptyText: {
    textAlign: 'center',
    color: '#95a5a6',
    fontStyle: 'italic',
    marginTop: 10,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 12,
    borderLeftWidth: 5,
    borderLeftColor: '#3498db',
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  cardCourse: {
    fontSize: 12,
    fontWeight: '600',
    color: '#e67e22',
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  cardDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 10,
  },
  cardActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#f1f2f6',
    paddingTop: 10,
  },
  editButton: {
    backgroundColor: '#f39c12',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
