# Advanced Data Processing Part 1: Complex Data Structures

## 1. Working with Complex Data Types

### 1.1 Nested Arrays
```javascript
// Example of processing nested arrays
const data = [
    {
        name: 'Group 1',
        items: [
            { id: 1, value: 'A' },
            { id: 2, value: 'B' }
        ]
    },
    {
        name: 'Group 2',
        items: [
            { id: 3, value: 'C' },
            { id: 4, value: 'D' }
        ]
    }
];

// Flattening nested structures
const flattenedItems = data.flatMap(group => 
    group.items.map(item => ({
        groupName: group.name,
        itemId: item.id,
        itemValue: item.value
    }))
);
```

### 1.2 Data Store Operations
```javascript
// Example of complex data store query
const query = {
    filter: {
        AND: [
            { field: 'status', op: 'eq', value: 'active' },
            { field: 'created_date', op: 'gt', value: '2024-01-01' }
        ]
    },
    sort: [
        { field: 'priority', direction: 'desc' },
        { field: 'created_date', direction: 'asc' }
    ],
    limit: 100
};
```

## 2. Advanced Data Transformation

### 2.1 Array Aggregation Techniques
```javascript
// Complex aggregation example
const results = {
    // Sum all values
    total: data.reduce((sum, item) => sum + item.value, 0),
    
    // Group by category
    byCategory: data.reduce((groups, item) => {
        const category = item.category;
        groups[category] = groups[category] || [];
        groups[category].push(item);
        return groups;
    }, {}),
    
    // Calculate averages per group
    averages: Object.entries(groups).reduce((avgs, [key, items]) => {
        avgs[key] = items.reduce((sum, item) => sum + item.value, 0) / items.length;
        return avgs;
    }, {})
};
```