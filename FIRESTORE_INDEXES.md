# Required Firestore Composite Indexes

## Collection: opportunities

### Index 1: Published opportunities by date
- **Query**: `getPublishedOpportunities`
- **where**: `status == 'published'`
- **orderBy**: `createdAt (desc)`

### Index 2: Featured opportunities by date
- **Query**: `getFeaturedOpportunities`
- **where**: `status == 'published'`, `isFeatured == true`
- **orderBy**: `createdAt (desc)`

### Index 3: User opportunities by date
- **Query**: `getOpportunitiesByUser`
- **where**: `postedBy == userId`
- **orderBy**: `createdAt (desc)`

### Index 4: Opportunities by status and date
- **Query**: `getOpportunitiesByStatus`
- **where**: `status == status`
- **orderBy**: `createdAt (desc)`

### Index 5: Published opportunities by category and date
- **Query**: `searchOpportunities` (with category filter)
- **where**: `status == 'published'`, `category == category`
- **orderBy**: `createdAt (desc)`

### Index 6: Published opportunities by industry and date
- **Query**: `searchOpportunities` (with industry filter)
- **where**: `status == 'published'`, `industry == industry`
- **orderBy**: `createdAt (desc)`

### Index 7: Published opportunities by investment range and date
- **Query**: `searchOpportunities` (with investmentRange filter)
- **where**: `status == 'published'`, `investmentRange == investmentRange`
- **orderBy**: `createdAt (desc)`

### Index 8: Published opportunities by location and date
- **Query**: `searchOpportunities` (with location filter)
- **where**: `status == 'published'`, `location == location`
- **orderBy**: `createdAt (desc)`

### Index 9: Published opportunities by business type and date
- **Query**: `searchOpportunities` (with businessType filter)
- **where**: `status == 'published'`, `businessType == businessType`
- **orderBy**: `createdAt (desc)`

### Index 10: Published opportunities by view count
- **Query**: `searchOpportunities` (sortBy: popular)
- **where**: `status == 'published'`
- **orderBy**: `viewCount (desc)`

### Index 11: Published opportunities by max investment
- **Query**: `searchOpportunities` (sortBy: investment_high)
- **where**: `status == 'published'`
- **orderBy**: `investmentMax (desc)`

### Index 12: Published opportunities by min investment
- **Query**: `searchOpportunities` (sortBy: investment_low)
- **where**: `status == 'published'`
- **orderBy**: `investmentMin (asc)`

## How to Create Indexes

1. Go to Firebase Console → Firestore Database → Indexes
2. Click "Add Index"
3. For each index above:
   - Collection ID: `opportunities`
   - Fields: Add the where clause field first, then the orderBy field
   - Set the appropriate order (asc/desc) for each field
4. Click "Create"

## Alternative: Auto-create via Firebase CLI

If you use Firebase CLI, the indexes will be auto-created when queries are run. The console will show links to create missing indexes.
