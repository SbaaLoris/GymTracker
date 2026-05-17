# ADR 0013: Provide CSV and PDF Export

## Status

Accepted

## Context

Mova stores personal workout and body metric data. Users should be able to access and reuse their own data outside the application.

Many applications make it difficult to export user data. The team wanted to avoid this limitation and provide a practical way for users to download their history.

This is especially useful because structured exports can also be used as context for analysis, reporting, or AI-assisted review.

## Decision

We decided to provide export functionality for user data in CSV and PDF format.

## Reasons

CSV and PDF export were selected because they provide:

- User control over personal data
- Practical reuse of workout and body metric history
- CSV files for structured data analysis (e.g. in Excel, Python, or AI contexts)
- PDF files for readable, well-formatted summaries and sharing
- A more complete and user-friendly application experience

## Alternatives Considered

Possible alternatives would have included:

- No export functionality
- CSV export only
- PDF export only
- API-only access to historical data

These alternatives were not selected because offering both CSV and PDF provides the best flexibility for different use cases.

## Consequences

### Positive

- Users can download and reuse their data.
- CSV exports can be used for analysis or AI-assisted interpretation.
- PDF exports provide a highly readable summary format.
- The feature makes the application feel more practical and complete.

### Negative

- Export logic adds backend complexity (e.g. generating PDFs via ReportLab or other libraries).
- CSV and PDF output must be kept consistent with the data model.
- The backend must handle binary file streaming and HTTP headers correctly.
