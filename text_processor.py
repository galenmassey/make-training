import re

def clean_text(text):
    # Remove HTML tags
    text = re.sub(r'<[^>]+>', '', text)
    
    # Remove special characters and HTML entities
    text = re.sub(r'&\w+;', ' ', text)
    text = re.sub(r'\\', '', text)
    
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text)
    
    # Remove DOCTYPE declarations
    text = re.sub(r'<!DOCTYPE[^>]*>', '', text)
    
    return text.strip()

def process_content(raw_content):
    # Split content by source markers
    sections = re.split(r'Content from:', raw_content)
    
    processed_text = []
    for section in sections:
        if section.strip():
            # Extract URL if present
            url_match = re.match(r'\s*(https?://[^\s]+)', section)
            if url_match:
                url = url_match.group(1)
                processed_text.append(f'\n\nSource: {url}\n')
                
            # Clean and add the content
            cleaned_text = clean_text(section)
            if cleaned_text:
                processed_text.append(cleaned_text)
    
    return '\n'.join(processed_text)

def main():
    # Sample usage
    with open('raw_content.txt', 'r', encoding='utf-8') as f:
        raw_content = f.read()
    
    processed_content = process_content(raw_content)
    
    with open('Make Training.txt', 'w', encoding='utf-8') as f:
        f.write(processed_content)

if __name__ == '__main__':
    main()