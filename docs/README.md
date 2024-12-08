# Documentation Process

## Setup

1. Copy `credentials.example.json` to `credentials.json`
2. Fill in your Make.com credentials in `credentials.json`
3. Never commit `credentials.json` to the repository

## Process for Adding Documentation

1. Log into Make.com using your credentials
2. Visit each URL in the `urls.txt` file
3. Copy the main content (excluding navigation, headers, footers)
4. Paste the content into appropriately named markdown files in the `docs` folder
5. Update the table of contents in this README

## Current Documentation

- [Make Academy](./academy.md)
- [Custom Apps Development](./custom-apps.md)
- [API Documentation](./api.md)

## Security Notes

- Keep credentials.json secure and never share it
- Don't store credentials in any committed files
- Use environment variables for automation scripts
