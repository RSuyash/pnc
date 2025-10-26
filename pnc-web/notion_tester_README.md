# Notion Integration Tester

This Python script helps you test and discover your Notion databases that are accessible through your integration.

## Setup

1. Make sure you have Python installed on your system
2. Install the required dependencies:

```bash
pip install -r requirements.txt
```

Or just install requests directly:

```bash
pip install requests
```

## Usage

Run the script:

```bash
python notion_tester.py
```

You will be prompted to enter your Notion integration token (which is already configured in your `.env.local` file as `NOTION_TOKEN`).

## What the script does

1. Tests the basic connection to the Notion API
2. Searches for all databases that your integration has access to
3. Shows the structure (schema) of each database
4. Shows sample data from each database
5. Provides next steps for using the integration in the web app

## Troubleshooting

If no databases are found:

1. Make sure your databases are shared with the integration
2. Go to your Notion database
3. Click "Share" 
4. Type the name of your integration
5. Add it and give it "Read" permissions

This is required for security reasons - Notion API only allows access to content that has been explicitly shared with the integration.