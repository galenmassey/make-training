# Make.com Documentation Scraper

## Setup

1. Install Node.js if not already installed
2. Clone this repository
3. Run `npm install` in the scraper directory
4. Copy `.env.example` to `.env`
5. Add your Make.com credentials to `.env`

## Usage

1. Run the scraper:
```bash
npm start
```

The script will:
- Log into Make.com using your credentials
- Visit each URL in urls.txt
- Save the content as text files in ./make_docs/

## Security Notes

- Never commit your .env file
- Keep your credentials secure
- The script runs in non-headless mode by default for debugging

## Troubleshooting

If you encounter issues:
1. Check your credentials
2. Ensure you have internet access
3. Check the console for error messages
4. Try running with show: true in puppeteer options to see what's happening