# Contributing to ezhuthurukal

We welcome contributions from the community! This project aims to be a comprehensive showcase of Tamil fonts. You can help by adding new fonts, improving metadata, or suggesting enhancements.

## Adding a New Font

### Step 1: Fork the Repository
Click the "Fork" button on GitHub to create your own copy of the repository.

### Step 2: Clone Locally
Clone your fork to your local machine:
```bash
git clone https://github.com/YOUR_USERNAME/ezhuthurukal.git
cd ezhuthurukal
```

### Step 3: Add Font Files
Create a folder for your font and add the font files:
```bash
mkdir -p public/fonts/font-name/
cp your-font.ttf public/fonts/font-name/Regular.ttf
```

If you have multiple variants (Bold, Italic, etc.), add them all:
```bash
cp your-font-bold.ttf public/fonts/font-name/Bold.ttf
cp your-font-italic.ttf public/fonts/font-name/Italic.ttf
```

### Step 4: Update Font Metadata
Add an entry to `public/meta/fonts.json`:

```json
{
  "id": "unique-font-id",
  "name": "Font Name",
  "category": "Unicode|TACE16|Other",
  "variants": ["Regular", "Bold"],
  "author": "Author Name",
  "license": "License type",
  "source": "Source URL",
  "description": "Description of the font",
  "tags": ["tag1", "tag2"],
  "sampleText": "வணக்கம் தமிழ் எழுத்துருக்கள் அழகானவை",
  "filename": "Regular.ttf"
}
```

**Important**: Make sure all variants are listed inside the `variantsList` array if using the new grouped structure.

### Step 5: Commit and Push
```bash
git add .
git commit -m "Add Font Name"
git push origin main
```

### Step 6: Create Pull Request
Go to the original repository and create a Pull Request. Include a detailed description of the font you're adding.

## License Guidelines

- Only add fonts that are free for **educational and research use**
- Include proper **attribution** to the font creator
- Link to the **original source** of the font
- Include a **license file** in the font folder if available
- Verify the font is not restricted for commercial use without permission

## Font Metadata Fields

| Field | Description | Required |
|-------|-------------|----------|
| `id` | Unique identifier (lowercase, hyphenated) | Yes |
| `name` | Display name of the font | Yes |
| `category` | Unicode, TACE16, or Other | Yes |
| `author` | Font creator or organization | Yes |
| `license` | License type or description | Yes |
| `source` | URL to original font source | Yes |
| `description` | Brief description of the font | Yes |
| `tags` | Array of keywords for search | No |
| `sampleText` | Tamil text for preview | No |
| `variants` | Array of available font variants | No |
| `filename` | Default font file to load | Yes |
| `downloadUrl` | Path to font file | Yes |

## Code Style

- Use functional components with React hooks
- Follow the existing component structure
- Use Tailwind CSS for styling
- Keep components small and focused
- Add comments for complex logic

## Testing

Before submitting your PR:
1. Run `npm run dev` and test locally
2. Check that the font appears in the gallery
3. Verify the font preview works correctly
4. Test the download functionality
5. Ensure search and filter work with your font

## Questions or Issues?

If you have questions or encounter issues while contributing, please open an [issue on GitHub](https://github.com/Abez-B/easy-tamil-font/issues). We're happy to help!

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Welcome newcomers to the project
- Focus on improving the project for everyone

Thank you for contributing to ezhuthurukal! 🙏
