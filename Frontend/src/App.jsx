import { useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";

import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";

import "highlight.js/styles/github-dark.css";

import "./App.css";

function App() {
  const [code, setCode] = useState(`function sum() {
  return 1 + 1;
}`);

  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function reviewCode() {
    if (loading) return;

    setLoading(true);
    setError("");
    setReview("");

    try {
      const response = await axios.post(
        "http://localhost:3000/ai/get-review",
        {
          code,
        }
      );

      setReview(response.data);
    } catch (err) {
      console.error(err);

      if (err.response) {
        setError(err.response.data.message || "Server Error");
      } else if (err.request) {
        setError("Cannot connect to backend server.");
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      {/* LEFT PANEL */}

      <div className="left">
        <div className="code">
          <Editor
            height="100%"
            defaultLanguage="javascript"
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value || "")}
            options={{
              fontSize: 15,
              fontFamily: "Fira Code",
              minimap: {
                enabled: false,
              },
              automaticLayout: true,
              scrollBeyondLastLine: false,
              wordWrap: "on",
              tabSize: 2,
              roundedSelection: true,
              cursorBlinking: "smooth",
              cursorSmoothCaretAnimation: "on",
              smoothScrolling: true,
              padding: {
                top: 15,
              },
            }}
          />
        </div>

        {/* Floating Review Button */}

        <button
          className="review-btn"
          onClick={reviewCode}
          disabled={loading}
        >
          {loading ? "⏳ Reviewing..." : " Review Code"}
        </button>
      </div>

      {/* RIGHT PANEL */}

      <div className="right">
        {loading && (
          <div className="loading-skeleton">
            <h2>🤖 AI is reviewing your code...</h2>

            <p>Please wait a few seconds.</p>
          </div>
        )}

        {!loading && error && (
          <div className="error-message">
            <h3>❌ Error</h3>

            <p>{error}</p>
          </div>
        )}

        {!loading && !error && !review && (
          <div className="placeholder">
            <div>
              <h2>🚀 AI Code Reviewer</h2>

              <p>
                Write or paste your code on the left and click
                <strong> Review Code </strong>
                to receive an AI-powered review.
              </p>
            </div>
          </div>
        )}

        {!loading && !error && review && (
          <div className="review-content">
            <Markdown rehypePlugins={[rehypeHighlight]}>
              {review}
            </Markdown>
          </div>
        )}
      </div>
    </main>
  );
}

export default App;