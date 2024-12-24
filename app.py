from flask import Flask, jsonify, render_template_string
from flask_cors import CORS
from openai import OpenAI

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests for frontend communication

# Initialize the OpenAI client
client = OpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key="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"
)

@app.route('/')
def get_movie_suggestions():
    print("Reading input from file")  # Debugging output
    with open('input.txt', 'r') as file:
        chat_content = file.read()

    movie_name = "avatar"  # Hard-coded movie name

    completion = client.chat.completions.create(
        model="meta/llama-3.1-8b-instruct",
        messages=[{
            "role": "user",
            "content": f" persons watching {movie_name} movie together and their chats are {chat_content}. Based on this chat, suggest 10 movies similar to this one. If they love this movie, try to recommend similar genres but anyone of them dont like dont suggest in that genre. If they mention any actor or director in a positive way, give suggestions involving that person. priority of for actor and director is maximum that other and just give me 10 movies followed by sr no nothing else "
        }],
        temperature=0.2,
        top_p=0.7,
        max_tokens=1024,
        stream=True
    )

    result = ""
    for chunk in completion:
        if chunk.choices[0].delta.content is not None:
            result += chunk.choices[0].delta.content

    print("Result:", result)  # Debugging output

    # Extract only the movie names (assuming each line is prefixed with a number and period)
    movie_names = [line.split('. ', 1)[1] for line in result.splitlines() if line.strip() and '. ' in line]

    # Render output on webpage
    html_content = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Movie Suggestions</title>
    </head>
    <body>
        <h1>Suggested Movies</h1>
        <ul>
            {''.join([f'<li>{movie}</li>' for movie in movie_names])}
        </ul>
    </body>
    </html>
    """

    return render_template_string(html_content)

if __name__ == '__main__':
    app.run(debug=True , port=5050)
