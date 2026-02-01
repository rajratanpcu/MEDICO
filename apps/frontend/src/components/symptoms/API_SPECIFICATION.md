// API_SPECIFICATION.md
// Complete API specification and backend integration guide

# Symptom Checker - API Specification & Backend Integration

## Overview

This document specifies the API contract between the frontend Symptom Checker component and the backend AI service for symptom analysis and disease prediction.

## Table of Contents

1. [Endpoint Overview](#endpoint-overview)
2. [Request Format](#request-format)
3. [Response Format](#response-format)
4. [Error Handling](#error-handling)
5. [Example Flows](#example-flows)
6. [Backend Implementation Guide](#backend-implementation-guide)
7. [Testing](#testing)
8. [Performance Considerations](#performance-considerations)

## Endpoint Overview

### Check Symptoms

Analyzes provided symptoms and returns predicted diseases with confidence scores.

```
POST /api/ai/check-symptoms
```

**Authentication**: Required (JWT Bearer token)

**Timeout**: 30 seconds (configurable)

**Rate Limit**: TBD (suggest 100 requests/hour per user)

## Request Format

### HTTP Method

```
POST /api/ai/check-symptoms
Content-Type: application/json
Authorization: Bearer {jwt_token}
```

### Request Body

```json
{
  "symptomIds": ["cough", "fever", "sore_throat"],
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "timestamp": "2024-01-22T10:30:00Z"
}
```

### Parameters

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| symptomIds | Array<string> | Yes | Array of symptom IDs (1-10) | ["cough", "fever"] |
| userId | String (UUID) | Yes | User's unique identifier | "550e8400-e29b-41d4-a716-446655440000" |
| timestamp | String (ISO 8601) | Yes | Request timestamp | "2024-01-22T10:30:00Z" |

### Validation Rules

```
✓ symptomIds:
  - Required
  - Must be array of strings
  - Length: 1-10 items
  - Each ID must be valid symptom ID from symptomData.js
  - No duplicates allowed
  - Example valid IDs: cough, fever, sore_throat, headache, nausea

✓ userId:
  - Required
  - Must be valid UUID format
  - Must match authenticated user's ID (security check)
  - Example: 550e8400-e29b-41d4-a716-446655440000

✓ timestamp:
  - Required
  - Must be ISO 8601 format
  - Should be current time (within 5 minutes)
  - Example: 2024-01-22T10:30:00Z
```

### Example Request (curl)

```bash
curl -X POST http://localhost:8080/api/ai/check-symptoms \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzUxMiJ9..." \
  -d '{
    "symptomIds": ["cough", "fever", "sore_throat"],
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "timestamp": "2024-01-22T10:30:00Z"
  }'
```

## Response Format

### Success Response (200 OK)

```json
{
  "success": true,
  "predictions": [
    {
      "disease_id": "common_cold",
      "disease_name": "Common Cold",
      "confidence": 82.5,
      "severity": "high",
      "description": "A viral infection of the upper respiratory tract caused by rhinoviruses or other common viral pathogens.",
      "matching_symptoms": ["Cough", "Sore Throat", "Fever"],
      "when_to_see_doctor": "See a doctor if symptoms last more than 10 days, if fever is above 103°F, or if you have severe breathing difficulty.",
      "self_care_tips": [
        "Get adequate rest and sleep (7-9 hours per night)",
        "Stay hydrated with water, herbal tea, and warm liquids",
        "Use over-the-counter pain relievers like acetaminophen or ibuprofen",
        "Gargle with warm salt water to soothe your throat",
        "Use a humidifier to ease congestion and coughing"
      ],
      "risk_factors": [
        "Recent exposure to someone with cold symptoms",
        "Weakened immune system",
        "Stress and lack of sleep"
      ],
      "additional_info": "The common cold is the most frequent infectious disease in humans. Most people recover within 7-10 days without medical treatment."
    },
    {
      "disease_id": "influenza",
      "disease_name": "Influenza (Flu)",
      "confidence": 68.3,
      "severity": "high",
      "description": "A viral respiratory infection caused by influenza viruses.",
      "matching_symptoms": ["Cough", "Fever"],
      "when_to_see_doctor": "Seek medical attention if you have difficulty breathing or severe chest pain.",
      "self_care_tips": [
        "Rest for several days",
        "Maintain hydration",
        "Take fever-reducing medications",
        "Use a humidifier"
      ],
      "risk_factors": [
        "Exposure to infected individuals",
        "Compromised immune system"
      ],
      "additional_info": "Influenza is more contagious and severe than the common cold."
    }
  ],
  "confidence": 92,
  "analysisId": "analysis-550e8400-e29b-41d4-a716-446655440000",
  "timestamp": "2024-01-22T10:30:45Z"
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| success | Boolean | Always true for success responses |
| predictions | Array<Prediction> | Ranked list of predicted diseases |
| confidence | Number (0-100) | Overall confidence in analysis |
| analysisId | String | Unique ID for this analysis (for tracking) |
| timestamp | String | Response timestamp (ISO 8601) |

### Prediction Object

| Field | Type | Description |
|-------|------|-------------|
| disease_id | String | Unique disease identifier (snake_case) |
| disease_name | String | Human-readable disease name |
| confidence | Number (0-100) | Confidence score for this prediction |
| severity | String | Level: critical \| high \| moderate \| low |
| description | String | Medical description (2-3 sentences) |
| matching_symptoms | Array<String> | User's symptoms that match this disease |
| when_to_see_doctor | String | Actionable guidance text (2-3 sentences) |
| self_care_tips | Array<String> | 3-5 self-care recommendations |
| risk_factors | Array<String> | 2-4 risk factors relevant to this disease |
| additional_info | String | Extra medical information (2-4 sentences) |

### Sorting

Predictions MUST be sorted by confidence score (highest first).

```
Prediction 1: 82.5% confidence (rank #1)
Prediction 2: 68.3% confidence (rank #2)
Prediction 3: 45.2% confidence (rank #3)
```

### Severity Levels

Map confidence score to severity:

```
confidence >= 80  → severity: "critical"
confidence >= 60  → severity: "high"
confidence >= 40  → severity: "moderate"
confidence <  40  → severity: "low"
```

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": "Invalid symptom IDs provided",
  "errorCode": "INVALID_SYMPTOMS",
  "details": [
    "symptom_xyz is not a valid symptom ID",
    "Valid symptom IDs are: cough, fever, sore_throat, ..."
  ],
  "timestamp": "2024-01-22T10:30:00Z"
}
```

### HTTP Status Codes & Responses

#### 400 Bad Request
**When**: Invalid request format or validation failure

```json
{
  "success": false,
  "error": "Invalid symptom IDs provided",
  "errorCode": "INVALID_SYMPTOMS",
  "details": ["symptom_xyz is not valid"],
  "timestamp": "2024-01-22T10:30:00Z"
}
```

#### 401 Unauthorized
**When**: Missing or invalid JWT token

```json
{
  "success": false,
  "error": "Unauthorized",
  "errorCode": "UNAUTHORIZED",
  "details": ["Missing or invalid authorization token"],
  "timestamp": "2024-01-22T10:30:00Z"
}
```

#### 403 Forbidden
**When**: User doesn't have permission or userId mismatch

```json
{
  "success": false,
  "error": "Forbidden",
  "errorCode": "FORBIDDEN",
  "details": ["You do not have permission to access this resource"],
  "timestamp": "2024-01-22T10:30:00Z"
}
```

#### 408 Request Timeout
**When**: Analysis took too long to complete

```json
{
  "success": false,
  "error": "Request timeout",
  "errorCode": "TIMEOUT",
  "details": ["The analysis took longer than expected. Please try again."],
  "timestamp": "2024-01-22T10:30:00Z"
}
```

#### 500 Internal Server Error
**When**: Backend service error

```json
{
  "success": false,
  "error": "Internal server error",
  "errorCode": "SERVER_ERROR",
  "details": ["An unexpected error occurred. Our team has been notified."],
  "timestamp": "2024-01-22T10:30:00Z"
}
```

### Error Codes Reference

| Code | HTTP Status | Message | Frontend Action |
|------|-------------|---------|-----------------|
| INVALID_SYMPTOMS | 400 | Invalid symptom IDs | Show validation error, user can correct |
| INVALID_USER_ID | 400 | Invalid user ID format | Show error, user must reauth |
| MISSING_FIELDS | 400 | Required fields missing | Show error, retry |
| SYMPTOMS_OUT_OF_RANGE | 400 | 1-10 symptoms required | Show validation error |
| UNAUTHORIZED | 401 | Missing/invalid token | Redirect to login |
| FORBIDDEN | 403 | No permission | Show forbidden error |
| TIMEOUT | 408 | Request timeout | Show timeout error, allow retry |
| SERVER_ERROR | 500 | Backend error | Show error, allow retry |
| SERVICE_UNAVAILABLE | 503 | Service down | Show unavailable message |

## Example Flows

### Flow 1: Happy Path (Success)

```
User selects 3 symptoms
       ↓
Frontend: POST /api/ai/check-symptoms
  {
    "symptomIds": ["cough", "fever", "sore_throat"],
    "userId": "user-123",
    "timestamp": "2024-01-22T10:30:00Z"
  }
       ↓
Backend: Analyzes symptoms
       ↓
Frontend receives: 200 OK with predictions array
       ↓
Display: 3 disease predictions sorted by confidence
       ↓
User can save results
```

### Flow 2: Validation Error (Invalid Symptoms)

```
User submits: symptomIds = ["cough", "xyz123"]
       ↓
Frontend: POST /api/ai/check-symptoms
       ↓
Backend: Validates and rejects (xyz123 not found)
       ↓
Frontend receives: 400 Bad Request
{
  "success": false,
  "error": "Invalid symptom IDs provided",
  "details": ["xyz123 is not a valid symptom ID"]
}
       ↓
Display: Error message "Invalid symptom IDs provided"
       ↓
User can retry with correct symptoms
```

### Flow 3: Timeout Error

```
User submits: 5 symptoms
       ↓
Frontend: POST /api/ai/check-symptoms
       ↓
Backend: Processing takes >30 seconds
       ↓
Frontend: 30 second timeout triggers
       ↓
Frontend receives: 408 Request Timeout
{
  "success": false,
  "error": "Request timeout",
  "details": ["The analysis took too long..."]
}
       ↓
Display: Timeout error message
       ↓
User can retry
```

### Flow 4: API Unavailable

```
User submits: symptoms
       ↓
Frontend: POST /api/ai/check-symptoms
       ↓
Backend: Service is down
       ↓
Frontend receives: 503 Service Unavailable
{
  "success": false,
  "error": "Service temporarily unavailable",
  "details": ["Please try again in a few moments"]
}
       ↓
Display: "Service unavailable, please try again later"
       ↓
User can retry later
```

## Backend Implementation Guide

### Pseudo-code Implementation

```java
@PostMapping("/api/ai/check-symptoms")
@PreAuthorize("isAuthenticated()")
public ResponseEntity<?> checkSymptoms(
    @Valid @RequestBody SymptomCheckRequest request,
    @AuthenticationPrincipal UserDetails userDetails) {
  
  try {
    // 1. Validate request
    if (request.getSymptomIds().isEmpty() || 
        request.getSymptomIds().size() > 10) {
      return ResponseEntity.badRequest().body(new ErrorResponse(
        "SYMPTOMS_OUT_OF_RANGE",
        "Please select 1-10 symptoms"
      ))
    }
    
    // 2. Verify userId matches authenticated user
    if (!request.getUserId().equals(userDetails.getId())) {
      return ResponseEntity.status(403).body(new ErrorResponse(
        "FORBIDDEN",
        "You cannot analyze symptoms for other users"
      ))
    }
    
    // 3. Validate symptom IDs exist
    List<String> invalidSymptoms = request.getSymptomIds().stream()
      .filter(id -> !symptomRepository.exists(id))
      .collect(toList())
    
    if (!invalidSymptoms.isEmpty()) {
      return ResponseEntity.badRequest().body(new ErrorResponse(
        "INVALID_SYMPTOMS",
        "Invalid symptom IDs: " + invalidSymptoms
      ))
    }
    
    // 4. Call AI service
    List<Prediction> predictions = aiService.analyzSymptoms(
      request.getSymptomIds(),
      timeout = 25_seconds  // Leave 5s buffer
    )
    
    // 5. Sort by confidence (descending)
    predictions.sort((a, b) -> 
      Double.compare(b.getConfidence(), a.getConfidence())
    )
    
    // 6. Add severity levels
    predictions.forEach(p -> 
      p.setSeverity(getSeverity(p.getConfidence()))
    )
    
    // 7. Save analysis record
    Analysis analysis = new Analysis()
      .setUserId(request.getUserId())
      .setSymptoms(request.getSymptomIds())
      .setPredictions(predictions)
      .setConfidence(calculateOverallConfidence(predictions))
      .setCreatedAt(now())
    
    analysisRepository.save(analysis)
    
    // 8. Return response
    return ResponseEntity.ok(new SymptomCheckResponse(
      true,
      predictions,
      analysis.getConfidence(),
      analysis.getId(),
      now()
    ))
    
  } catch (TimeoutException ex) {
    return ResponseEntity.status(408).body(new ErrorResponse(
      "TIMEOUT",
      "Analysis took too long. Please try again."
    ))
    
  } catch (Exception ex) {
    logger.error("Error analyzing symptoms", ex)
    return ResponseEntity.status(500).body(new ErrorResponse(
      "SERVER_ERROR",
      "An unexpected error occurred"
    ))
  }
}

// Helper: Map confidence to severity
private String getSeverity(double confidence) {
  if (confidence >= 80) return "critical"
  if (confidence >= 60) return "high"
  if (confidence >= 40) return "moderate"
  return "low"
}

// Helper: Calculate overall confidence
private double calculateOverallConfidence(List<Prediction> predictions) {
  if (predictions.isEmpty()) return 0
  return predictions.get(0).getConfidence()
}
```

### Request Validation

```java
@Data
public class SymptomCheckRequest {
  
  @NotNull(message = "symptomIds is required")
  @NotEmpty(message = "symptomIds must contain at least 1 symptom")
  @Size(min = 1, max = 10, message = "symptomIds must have 1-10 items")
  private List<String> symptomIds
  
  @NotNull(message = "userId is required")
  @Pattern(regexp = UUID_REGEX, message = "userId must be valid UUID")
  private String userId
  
  @NotNull(message = "timestamp is required")
  @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'")
  private Instant timestamp
}
```

### Response Models

```java
@Data
public class SymptomCheckResponse {
  private boolean success = true
  private List<PredictionDTO> predictions
  private double confidence
  private String analysisId
  private String timestamp
}

@Data
public class PredictionDTO {
  private String disease_id
  private String disease_name
  private double confidence    // 0-100
  private String severity      // critical|high|moderate|low
  private String description
  private List<String> matching_symptoms
  private String when_to_see_doctor
  private List<String> self_care_tips
  private List<String> risk_factors
  private String additional_info
}

@Data
public class ErrorResponse {
  private boolean success = false
  private String error
  private String errorCode
  private List<String> details
  private String timestamp
}
```

### Database Schema

```sql
-- Analyses table
CREATE TABLE analyses (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  symptom_ids TEXT[] NOT NULL,
  confidence DECIMAL(5,2) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
)

-- Analysis predictions
CREATE TABLE analysis_predictions (
  id UUID PRIMARY KEY,
  analysis_id UUID NOT NULL REFERENCES analyses(id),
  disease_id VARCHAR(100) NOT NULL,
  disease_name VARCHAR(255) NOT NULL,
  confidence DECIMAL(5,2) NOT NULL,
  severity VARCHAR(20) NOT NULL,
  description TEXT NOT NULL,
  matching_symptoms TEXT[] NOT NULL,
  when_to_see_doctor TEXT NOT NULL,
  self_care_tips TEXT[] NOT NULL,
  risk_factors TEXT[] NOT NULL,
  additional_info TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL
)

CREATE INDEX idx_analyses_user_id ON analyses(user_id)
CREATE INDEX idx_predictions_analysis_id ON analysis_predictions(analysis_id)
```

## Testing

### Test Cases

```bash
# Test 1: Valid request with 3 symptoms
curl -X POST http://localhost:8080/api/ai/check-symptoms \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "symptomIds": ["cough", "fever", "sore_throat"],
    "userId": "user-123",
    "timestamp": "2024-01-22T10:30:00Z"
  }'
# Expected: 200 OK with predictions array

# Test 2: No symptoms
curl -X POST http://localhost:8080/api/ai/check-symptoms \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "symptomIds": [],
    "userId": "user-123",
    "timestamp": "2024-01-22T10:30:00Z"
  }'
# Expected: 400 Bad Request with SYMPTOMS_OUT_OF_RANGE error

# Test 3: Invalid symptom ID
curl -X POST http://localhost:8080/api/ai/check-symptoms \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "symptomIds": ["xyz123"],
    "userId": "user-123",
    "timestamp": "2024-01-22T10:30:00Z"
  }'
# Expected: 400 Bad Request with INVALID_SYMPTOMS error

# Test 4: Missing authorization
curl -X POST http://localhost:8080/api/ai/check-symptoms \
  -H "Content-Type: application/json" \
  -d '{
    "symptomIds": ["cough", "fever"],
    "userId": "user-123",
    "timestamp": "2024-01-22T10:30:00Z"
  }'
# Expected: 401 Unauthorized
```

## Performance Considerations

### Timeout Handling

- Frontend timeout: 30 seconds
- Backend should complete analysis within 25 seconds
- Allows 5 second buffer for network overhead

### Caching Strategies

```
Consider caching common symptom combinations:
- Frequency-based caching (most common combinations)
- TTL: 24 hours
- Cache key: hash(sorted(symptomIds))
```

### Rate Limiting

```
Suggested: 100 requests/hour per user
- Prevents abuse
- Tracks quota per userId
- Returns 429 Too Many Requests when exceeded
```

### Monitoring

```
Log the following:
- Request timestamp
- User ID
- Symptom IDs
- Response status
- Analysis duration
- Errors/exceptions
- Model version used
```

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2024-01-22 | Initial API specification |

## Contact

For API updates or issues, contact the backend team.
