import { GoogleGenAI, Type } from "@google/genai";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are an expert HTML5 Game Developer specializing in YouTube Playables for 5-year-old children.
Your goal is to write single-file, self-contained HTML5 games that are fully functional and polished (not prototypes).

CRITICAL MOBILE DESIGN RULES:
1. **Touch Controls**: Buttons must be HUGE (minimum 80px x 80px). Place them in bottom-left/right corners for thumb access.
2. **Responsiveness**: Use 'touchstart' and 'touchend' listeners. Prevent default behavior (e.g., e.preventDefault()) to stop scrolling/zooming.
3. **Layout**: Game must scale to fit window.innerWidth/innerHeight. Handle resize events.
4. **Visuals**: High contrast, bright neon/cartoon colors. Large text for reading.

GAME FLOW & RETRY LOGIC (CRITICAL):
1. **Lose Condition**: If the player loses (e.g., hits obstacle, falls), show a "Game Over" screen immediately.
2. **Retry Button**: The Game Over screen MUST have a large, prominent 'Retry' button.
3. **Functionality**: Clicking 'Retry' must immediately reset the game state variables (score, position, enemies) and restart the level without reloading the page.
4. **No Dead Ends**: Never leave the player staring at a screen with no buttons.

EDUCATIONAL ENHANCEMENTS:
1. If the game involves planets, use real names (Mars, Jupiter) and correct colors.
2. If the game involves geography, incorporate State names or Capitals as gameplay elements (e.g., "Collect the coin on Texas").
3. "Stealth Learning": Show fun facts as rewards.

QUIZ & LEARN LOGIC:
1. If the request is a "Quiz" or "Learn Mode", DO NOT use Game Over screens. If the child is wrong, just shake the screen or play a funny sound and let them try again.
2. Positive Reinforcement: Use confetti, cheering audio, or stars for correct answers.
3. Navigation: Always provide a "Back to Menu" button so the child can switch modes.

MULTI-MODE GAME ARCHITECTURE:
1. Use a simple state machine pattern (variable 'gameState' = 'MENU' | 'PLAY' | 'GAME_OVER' | 'QUIZ' | 'LEARN').
2. The 'MENU' should be the default state after the Title Screen.
3. Handle input differently based on the current state.

TECHNICAL CONSTRAINTS:
1. Single HTML string (HTML, CSS, JS inline).
2. Canvas API for rendering.
3. Web Audio API for generated sound effects.
4. **Libraries**: You MAY use external CDNs (e.g., cdnjs) for libraries like Three.js, Matter.js, or Confetti.js if the user specifically requests "3D" or "Physics". Otherwise, stick to vanilla JS.
5. **Title Screen**: Game MUST start with a Title Screen with the Game Name and a big 'Start' button. Do not start gameplay immediately. This is required to unlock AudioContext.

When the user asks for a game, return ONLY the HTML code block.
`;

export const generateGameCode = async (prompt: string, currentCode?: string): Promise<string> => {
  try {
    const fullPrompt = currentCode 
      ? `Here is an existing HTML5 game code:\n\n${currentCode}\n\nRequest: ${prompt}\n\nPlease modify the code above to satisfy the request. Return the FULL updated HTML file.`
      : `Create a new HTML5 game. Description: ${prompt}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Using Pro for better coding logic
      contents: fullPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        thinkingConfig: { thinkingBudget: 2048 }, // Enable thinking for better code logic
      },
    });

    const text = response.text || '';
    
    // Extract code from markdown block if present
    const codeMatch = text.match(/```html([\s\S]*?)```/) || text.match(/```([\s\S]*?)```/);
    if (codeMatch) {
      return codeMatch[1].trim();
    }
    
    // If no code block, return raw text assuming it's the code
    return text;
  } catch (error) {
    console.error("Error generating game:", error);
    throw error;
  }
};

export const suggestGameIdeas = async (): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "List 3 simple, fun game ideas for 5-year-old twin boys. Examples: Hill Climber, Planet Smasher. Return only the titles as a JSON array of strings.",
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
        },
      }
    });
    
    return JSON.parse(response.text || '[]');
  } catch (error) {
    return ["Space Rocket Racer", "Dinosaur Jump", "Color Matcher"];
  }
};