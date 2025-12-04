import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { buildBrandCompliancePrompt } from '@/lib/prompts/brand-compliance-prompt';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Basic validation
    if (!body) {
      return NextResponse.json(
        { error: 'Request body is required' },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OPENAI_API_KEY is not configured' },
        { status: 500 }
      );
    }

    // Validate required fields
    if (!body.sampleCopy || !body.brandGuidelines) {
      return NextResponse.json(
        { error: 'sampleCopy and brandGuidelines are required' },
        { status: 400 }
      );
    }

    // Build the system prompt using the brand compliance prompt template
    const systemPrompt = buildBrandCompliancePrompt(
      body.brandGuidelines,
      body.sampleCopy,
      body.context
    );

    // Check if streaming is requested
    const shouldStream = body.stream !== false; // Default to streaming

    if (shouldStream) {
      // Streaming response
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Please analyze this copy for brand compliance: "${body.sampleCopy}"`
          }
        ],
        stream: true,
        temperature: 0.3, // Lower temperature for more consistent JSON output
      });

      // Create a ReadableStream for the response
      const encoder = new TextEncoder();
      let accumulatedContent = '';
      
      const readableStream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of completion) {
              const content = chunk.choices[0]?.delta?.content || '';
              if (content) {
                accumulatedContent += content;
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
              }
            }
            
            // Try to parse the final JSON response and format it nicely
            try {
              // Extract JSON from the response (might have extra text)
              const jsonMatch = accumulatedContent.match(/\{[\s\S]*\}/);
              if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                // Format the JSON response for display
                const formatted = formatBrandComplianceResponse(parsed);
                // Send formatted response as a special message
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ formatted, type: 'formatted' })}\n\n`));
              }
            } catch (parseError) {
              // If parsing fails, just send the raw content
              console.error('Error parsing JSON response:', parseError);
            }
            
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            controller.close();
          } catch (error) {
            console.error('Streaming error:', error);
            controller.error(error);
          }
        },
      });

      return new Response(readableStream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    } else {
      // Non-streaming response (for testing)
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Please analyze this copy for brand compliance: "${body.sampleCopy}"`
          }
        ],
        temperature: 0.3, // Lower temperature for more consistent JSON output
      });

      const responseContent = completion.choices[0]?.message?.content || 'No response';
      
      // Try to parse JSON from response
      try {
        const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          const formatted = formatBrandComplianceResponse(parsed);
          return NextResponse.json({
            message: 'OpenAI API call successful',
            response: formatted,
            raw: responseContent,
            parsed: parsed,
            model: completion.model,
          });
        }
      } catch (parseError) {
        console.error('Error parsing JSON response:', parseError);
      }

      return NextResponse.json({
        message: 'OpenAI API call successful',
        response: responseContent,
        model: completion.model,
      });
    }
  } catch (error: any) {
    console.error('Error in brand-compliance API route:', error);
    
    // Provide more specific error messages
    if (error?.status === 401) {
      return NextResponse.json(
        { error: 'Invalid OpenAI API key' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error?.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Formats the brand compliance JSON response into a human-readable format
 */
function formatBrandComplianceResponse(data: any): string {
  let formatted = '';
  
  // Compliance status
  const isCompliant = data.brand_compliance_yes_no === 'yes';
  formatted += `## Brand Compliance: ${isCompliant ? '✅ YES' : '❌ NO'}\n\n`;
  
  // At-risk excerpts
  if (data.at_risk_brand_excerpts && data.at_risk_brand_excerpts.length > 0) {
    formatted += `## Issues Found (${data.at_risk_brand_excerpts.length})\n\n`;
    
    data.at_risk_brand_excerpts.forEach((excerpt: any, index: number) => {
      const severityEmoji = excerpt.severity === 'critical' ? '🔴' : 
                           excerpt.severity === 'major' ? '🟠' : '🟡';
      
      formatted += `### ${index + 1}. ${severityEmoji} ${excerpt.severity.toUpperCase()} - ${excerpt.violated_guideline}\n\n`;
      formatted += `**Excerpt:** "${excerpt.excerpt}"\n\n`;
      formatted += `**Explanation:** ${excerpt.explanation}\n\n`;
      if (excerpt.suggested_edit) {
        formatted += `**Suggested Edit:** "${excerpt.suggested_edit}"\n\n`;
      }
      formatted += '---\n\n';
    });
  } else {
    formatted += '**No issues found. The copy is fully compliant with brand guidelines.**\n';
  }
  
  return formatted;
}

