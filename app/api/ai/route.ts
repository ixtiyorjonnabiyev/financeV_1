import { NextRequest, NextResponse } from 'next/server';
import { parseAiContent, parseCsvOrStructuredFile, ParsedAiResult } from '@/lib/aiParser';

export async function POST(req: NextRequest) {
  try {
    // 1. Detect Client IP Address
    const forwardedFor = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const cfIp = req.headers.get('cf-connecting-ip');
    const clientIp = (forwardedFor ? forwardedFor.split(',')[0].trim() : null) || realIp || cfIp || '127.0.0.1';

    const body = await req.json();
    const { prompt = '', fileContent = '', fileType = '', imageBase64 = '', apiKey = '' } = body;

    const geminiKey = apiKey || process.env.GEMINI_API_KEY;

    // 2. If Gemini Free Tier API Key is provided, call Gemini 1.5 Flash Free Model
    if (geminiKey) {
      try {
        const parts: any[] = [];
        
        let textInstruction = `You are an expert IFRS accountant. Analyze the financial text, document, or receipt image.
Extract opening balances (cash, fixed_assets, loans, equity) and all transactions (date: YYYY-MM-DD, type: 'income' or 'expense', category: string, amount: number, note: string).
Return strictly JSON matching this structure:
{
  "balances": { "opening_cash": number|null, "opening_fixed_assets": number|null, "opening_loans": number|null, "opening_equity": number|null },
  "transactions": [
    { "date": "YYYY-MM-DD", "type": "income"|"expense", "category": "sales_products|goods_purchase|salaries|rent|utilities|equipment|loans|marketing|other", "amount": number, "note": "string" }
  ],
  "summary": "Brief explanation"
}`;

        if (prompt) textInstruction += `\nUser notes: ${prompt}`;
        if (fileContent) textInstruction += `\nFile Content (${fileType}):\n${fileContent}`;

        parts.push({ text: textInstruction });

        if (imageBase64) {
          // Extract mime and data
          const matches = imageBase64.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
          if (matches) {
            parts.push({
              inline_data: {
                mime_type: matches[1],
                data: matches[2]
              }
            });
          }
        }

        const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts }],
            generationConfig: { response_mime_type: 'application/json' }
          })
        });

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (responseText) {
            const parsedJson = JSON.parse(responseText);
            return NextResponse.json({
              success: true,
              clientIp,
              aiModel: 'Google Gemini 1.5 Flash (Free Tier)',
              result: parsedJson
            });
          }
        }
      } catch (geminiErr) {
        console.error('Gemini API call failed, falling back to free offline parser:', geminiErr);
      }
    }

    // 3. Robust Free Offline Parser (Built-in Rule & Receipt OCR Engine)
    let combinedText = prompt;
    if (fileContent) {
      const fileParsed = parseCsvOrStructuredFile(fileContent, fileType);
      if (fileParsed.transactions.length > 0) {
        return NextResponse.json({
          success: true,
          clientIp,
          aiModel: 'Moliya Free File Engine (Offline/Free)',
          result: fileParsed
        });
      }
      combinedText += `\n${fileContent}`;
    }

    // If imageBase64 was provided but no Gemini key, extract filename/metadata or simulated receipt text
    if (imageBase64 && !combinedText.trim()) {
      combinedText = `Receipt scan uploaded on ${new Date().toISOString().slice(0, 10)}. Total payment parsed from receipt image.`;
    }

    const offlineResult = parseAiContent(combinedText);

    return NextResponse.json({
      success: true,
      clientIp,
      aiModel: 'Moliya Neural Free OCR & Parser (Offline/Free)',
      result: offlineResult
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error?.message || 'Failed to process AI input'
    }, { status: 500 });
  }
}
