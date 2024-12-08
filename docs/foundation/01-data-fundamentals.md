# Data Fundamentals in Make

## Understanding Data Types

### Basic Data Types

1. Text (String)
   - Single-line text
   - Multi-line text
   - Formatted text

2. Numbers
   - Integers
   - Decimals
   - Currency values

3. Dates and Times
   - Date formats
   - Time zones
   - Duration calculations

4. Boolean
   - True/False values
   - Yes/No flags
   - Conditional logic

5. Arrays
   - Lists of items
   - Collections
   - Nested data structures

## Data Mapping

### Basic Mapping Concepts

1. Source to Target
   ```plaintext
   [Source Module] → [Target Module]
   Field Mapping:
   - source.name → target.fullName
   - source.email → target.emailAddress
   ```

2. Data Transformation
   - Text formatting
   - Number formatting
   - Date formatting

### Practical Examples

1. Contact Information
   ```plaintext
   Input:
   firstName: "John"
   lastName: "Doe"
   
   Output:
   fullName: "John Doe"
   ```

2. Date Formatting
   ```plaintext
   Input:
   rawDate: "2024-12-08"
   
   Output:
   formattedDate: "December 8, 2024"
   ```

## Data Processing Rules

1. Data Validation
   - Required fields
   - Data type checking
   - Format validation

2. Error Handling
   - Missing data
   - Invalid formats
   - Null values

## Best Practices

1. Data Cleansing
   - Remove unnecessary spaces
   - Standardize formats
   - Handle special characters

2. Performance Optimization
   - Minimize data transfer
   - Batch processing
   - Efficient mapping

## Exercises

1. Basic Contact Processing
   ```plaintext
   Goal: Create a scenario that processes contact information
   Input: CSV file with names and emails
   Output: Formatted contact records
   ```

2. Date Standardization
   ```plaintext
   Goal: Standardize dates from multiple sources
   Input: Various date formats
   Output: Consistent date format
   ```

## Assessment

Complete these tasks to demonstrate understanding:

1. Create a scenario that:
   - Accepts various data types
   - Performs basic transformations
   - Handles errors appropriately
   - Produces formatted output

2. Document your approach to:
   - Data validation
   - Error handling
   - Format standardization

---

Next: [Working with APIs](./02-working-with-apis.md)