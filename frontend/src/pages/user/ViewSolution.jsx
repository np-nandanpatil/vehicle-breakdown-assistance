import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { db, auth } from "../../config/firebase";
import { fallbackProblemIndex } from "./ViewProblems";

export default function ViewSolution() {
  const { problemId } = useParams();
  const [solution, setSolution] = useState(null);
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const navigate = useNavigate();
  const fallbackProblem = fallbackProblemIndex[problemId];

  useEffect(() => {
    const fetchSolution = async () => {
      try {
        const problemDoc = await getDoc(doc(db, "problems", problemId));
        if (problemDoc.exists()) {
          const problemData = { id: problemId, ...problemDoc.data() };
          setProblem(problemData);

          if (problemData.solutionId) {
            const solutionDoc = await getDoc(doc(db, "solutions", problemData.solutionId));
            if (solutionDoc.exists()) {
              setSolution(solutionDoc.data());
            } else if (fallbackProblem) {
              setSolution(fallbackProblem.solution);
            }
          } else if (fallbackProblem) {
            setSolution(fallbackProblem.solution);
          }

          return;
        }

        if (fallbackProblem) {
          setProblem(fallbackProblem);
          setSolution(fallbackProblem.solution);
          return;
        }

        setProblem(null);
        setSolution(null);
      } catch (error) {
        console.error("Error fetching solution:", error);
        if (fallbackProblem) {
          setProblem(fallbackProblem);
          setSolution(fallbackProblem.solution);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSolution();
    getLocation();
  }, [problemId, fallbackProblem]);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: new Date()
          });
        },
        (error) => {
          console.log("Location access denied:", error);
        }
      );
    }
  };

  if (loading) return <div className="solution-container"><p>Loading...</p></div>;

  if (!problem || !solution) {
    return (
      <div className="solution-container">
        <div className="card" style={{ textAlign: "center", padding: "2rem" }}>
          <p>Solution not found</p>
          <button onClick={() => navigate(-1)} className="btn btn-primary mt-2">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const extractYoutubeId = (url) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  return (
    <div className="solution-container">
      <div className="solution-header">
        <h1>{problem.title}</h1>
        <p style={{ color: "#64748b", marginTop: "0.5rem" }}>{problem.description}</p>
        {userLocation && (
          <p style={{ fontSize: "0.9rem", color: "#999", marginTop: "1rem" }}>
            📍 Location captured: {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
          </p>
        )}
      </div>

      {solution.videoLink && (
        <div className="video-container">
          <div style={{ color: "white", marginBottom: "1rem", fontWeight: 600 }}>Watch Video Tutorial:</div>
          <iframe
            src={`https://www.youtube.com/embed/${extractYoutubeId(solution.videoLink)}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          <div style={{ marginTop: "1rem", textAlign: "center" }}>
            <a
              className="btn btn-secondary"
              href={solution.videoLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open on YouTube
            </a>
          </div>
        </div>
      )}

      <div className="solution-content">
        <h2>Solution</h2>
        <p>{solution.description}</p>

        {solution.steps && solution.steps.length > 0 && (
          <>
            <h2>Step-by-Step Guide</h2>
            <ol>
              {solution.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </>
        )}

        {solution.tools && solution.tools.length > 0 && (
          <>
            <h2>Tools Required</h2>
            <ul>
              {solution.tools.map((tool, index) => (
                <li key={index}>{tool}</li>
              ))}
            </ul>
          </>
        )}

        {solution.precautions && (
          <>
            <h2>Important Precautions</h2>
            <p>{solution.precautions}</p>
          </>
        )}

        <div style={{ marginTop: "2rem", padding: "1.5rem", backgroundColor: "#f0f9ff", borderLeft: "4px solid #2563eb", borderRadius: "0.5rem" }}>
          <strong>💡 Tip:</strong> If this solution doesn't resolve your issue, please give us feedback so we can help better next time.
        </div>
      </div>

      <div style={{ marginTop: "2rem", display: "flex", gap: "1rem", justifyContent: "center" }}>
        <button onClick={() => navigate(-1)} className="btn btn-secondary">
          ← Back
        </button>
        <button onClick={() => navigate("/feedback")} className="btn btn-primary">
          Give Feedback →
        </button>
      </div>
    </div>
  );
}
