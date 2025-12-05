import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';

export default function ManageProblemsAndSolutions() {
    const [problems, setProblems] = useState([]);
    const [selectedProblem, setSelectedProblem] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showProblemForm, setShowProblemForm] = useState(false);
    const [showSolutionForm, setShowSolutionForm] = useState(false);

    const [problemForm, setProblemForm] = useState({
        title: '',
        vehicleType: '2-wheeler',
        description: ''
    });

    const [solutionForm, setSolutionForm] = useState({
        description: '',
        videoLink: '',
        steps: [''],
        tools: [''],
        precautions: ''
    });

    useEffect(() => {
        fetchProblems();
    }, []);

    const fetchProblems = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'problems'));
            const problemsList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProblems(problemsList);
        } catch (error) {
            console.error('Error fetching problems:', error);
        }
    };

    const handleProblemSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            await addDoc(collection(db, 'problems'), {
                ...problemForm,
                createdAt: new Date()
            });

            setMessage('Problem added successfully!');
            setProblemForm({ title: '', vehicleType: '2-wheeler', description: '' });
            setShowProblemForm(false);
            fetchProblems();
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleSolutionSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            // Create solution document
            const solutionDoc = await addDoc(collection(db, 'solutions'), {
                problemId: selectedProblem.id,
                description: solutionForm.description,
                videoLink: solutionForm.videoLink,
                steps: solutionForm.steps.filter(s => s.trim() !== ''),
                tools: solutionForm.tools.filter(t => t.trim() !== ''),
                precautions: solutionForm.precautions,
                createdAt: new Date()
            });

            // Update problem with solution reference
            await updateDoc(doc(db, 'problems', selectedProblem.id), {
                solutionId: solutionDoc.id
            });

            setMessage('Solution added successfully!');
            setSolutionForm({ description: '', videoLink: '', steps: [''], tools: [''], precautions: '' });
            setShowSolutionForm(false);
            setSelectedProblem(null);
            fetchProblems();
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProblem = async (id) => {
        if (window.confirm('Are you sure? This will also delete the associated solution.')) {
            try {
                await deleteDoc(doc(db, 'problems', id));
                setMessage('Problem deleted successfully!');
                fetchProblems();
            } catch (error) {
                setMessage(`Error: ${error.message}`);
            }
        }
    };

    const addStep = () => {
        setSolutionForm({ ...solutionForm, steps: [...solutionForm.steps, ''] });
    };

    const addTool = () => {
        setSolutionForm({ ...solutionForm, tools: [...solutionForm.tools, ''] });
    };

    const updateStep = (index, value) => {
        const newSteps = [...solutionForm.steps];
        newSteps[index] = value;
        setSolutionForm({ ...solutionForm, steps: newSteps });
    };

    const updateTool = (index, value) => {
        const newTools = [...solutionForm.tools];
        newTools[index] = value;
        setSolutionForm({ ...solutionForm, tools: newTools });
    };

    const removeStep = (index) => {
        setSolutionForm({ ...solutionForm, steps: solutionForm.steps.filter((_, i) => i !== index) });
    };

    const removeTool = (index) => {
        setSolutionForm({ ...solutionForm, tools: solutionForm.tools.filter((_, i) => i !== index) });
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>⚙️ Manage Problems & Solutions</h1>
                <p>Create problems and add their solutions</p>
            </div>

            {message && (
                <div className={message.includes('Error') ? 'error-message' : 'success-message'}>
                    {message}
                </div>
            )}

            {/* Add Problem Button */}
            <div style={{ marginBottom: '2rem' }}>
                <button
                    onClick={() => setShowProblemForm(!showProblemForm)}
                    className="btn btn-primary"
                >
                    {showProblemForm ? '✕ Cancel' : '+ Add New Problem'}
                </button>
            </div>

            {/* Add Problem Form */}
            {showProblemForm && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h2>Add New Problem</h2>
                    <form onSubmit={handleProblemSubmit}>
                        <div className="form-group">
                            <label>Vehicle Type</label>
                            <select
                                value={problemForm.vehicleType}
                                onChange={(e) => setProblemForm({ ...problemForm, vehicleType: e.target.value })}
                                required
                            >
                                <option value="2-wheeler">2-Wheeler</option>
                                <option value="3-wheeler">3-Wheeler</option>
                                <option value="4-wheeler">4-Wheeler</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Problem Title</label>
                            <input
                                type="text"
                                value={problemForm.title}
                                onChange={(e) => setProblemForm({ ...problemForm, title: e.target.value })}
                                placeholder="E.g., Flat Tire"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                value={problemForm.description}
                                onChange={(e) => setProblemForm({ ...problemForm, description: e.target.value })}
                                placeholder="Describe the problem..."
                                rows="3"
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Adding...' : 'Add Problem'}
                        </button>
                    </form>
                </div>
            )}

            {/* Problems List */}
            <div className="card">
                <h2>All Problems</h2>
                {problems.length === 0 ? (
                    <p style={{ color: '#64748b', marginTop: '1rem' }}>No problems added yet.</p>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
                        {problems.map(problem => (
                            <div
                                key={problem.id}
                                style={{
                                    padding: '1.5rem',
                                    background: '#f8fafc',
                                    borderRadius: '8px',
                                    borderLeft: '4px solid #2563eb'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                    <div>
                                        <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>{problem.title}</h3>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '12px',
                                            fontSize: '0.85rem',
                                            background: '#dbeafe',
                                            color: '#1e40af'
                                        }}>
                                            {problem.vehicleType}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteProblem(problem.id)}
                                        className="btn"
                                        style={{ background: '#ef4444', color: 'white', padding: '0.5rem 1rem' }}
                                    >
                                        Delete
                                    </button>
                                </div>

                                <p style={{ color: '#64748b', marginBottom: '1rem' }}>{problem.description}</p>

                                {problem.solutionId ? (
                                    <div style={{
                                        padding: '1rem',
                                        background: '#d1fae5',
                                        borderRadius: '6px',
                                        marginTop: '1rem'
                                    }}>
                                        <strong>✅ Solution Added</strong>
                                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>
                                            This problem has a solution configured.
                                        </p>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => {
                                            setSelectedProblem(problem);
                                            setShowSolutionForm(true);
                                        }}
                                        className="btn btn-primary"
                                        style={{ marginTop: '1rem' }}
                                    >
                                        + Add Solution
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Solution Modal */}
            {showSolutionForm && selectedProblem && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '2rem'
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '2rem',
                        maxWidth: '800px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflow: 'auto'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h2 style={{ margin: 0 }}>Add Solution for: {selectedProblem.title}</h2>
                            <button
                                onClick={() => {
                                    setShowSolutionForm(false);
                                    setSelectedProblem(null);
                                }}
                                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSolutionSubmit}>
                            <div className="form-group">
                                <label>Solution Description</label>
                                <textarea
                                    value={solutionForm.description}
                                    onChange={(e) => setSolutionForm({ ...solutionForm, description: e.target.value })}
                                    placeholder="Describe the solution..."
                                    rows="3"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>YouTube Video Link</label>
                                <input
                                    type="url"
                                    value={solutionForm.videoLink}
                                    onChange={(e) => setSolutionForm({ ...solutionForm, videoLink: e.target.value })}
                                    placeholder="https://youtube.com/..."
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Step-by-Step Instructions</label>
                                {solutionForm.steps.map((step, index) => (
                                    <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        <input
                                            type="text"
                                            value={step}
                                            onChange={(e) => updateStep(index, e.target.value)}
                                            placeholder={`Step ${index + 1}`}
                                            style={{ flex: 1 }}
                                        />
                                        {solutionForm.steps.length > 1 && (
                                            <button type="button" onClick={() => removeStep(index)} className="btn" style={{ background: '#ef4444', color: 'white' }}>
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button type="button" onClick={addStep} className="btn btn-secondary" style={{ marginTop: '0.5rem' }}>
                                    + Add Step
                                </button>
                            </div>

                            <div className="form-group">
                                <label>Required Tools</label>
                                {solutionForm.tools.map((tool, index) => (
                                    <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        <input
                                            type="text"
                                            value={tool}
                                            onChange={(e) => updateTool(index, e.target.value)}
                                            placeholder={`Tool ${index + 1}`}
                                            style={{ flex: 1 }}
                                        />
                                        {solutionForm.tools.length > 1 && (
                                            <button type="button" onClick={() => removeTool(index)} className="btn" style={{ background: '#ef4444', color: 'white' }}>
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button type="button" onClick={addTool} className="btn btn-secondary" style={{ marginTop: '0.5rem' }}>
                                    + Add Tool
                                </button>
                            </div>

                            <div className="form-group">
                                <label>Safety Precautions</label>
                                <textarea
                                    value={solutionForm.precautions}
                                    onChange={(e) => setSolutionForm({ ...solutionForm, precautions: e.target.value })}
                                    placeholder="List important safety precautions..."
                                    rows="2"
                                />
                            </div>

                            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
                                {loading ? 'Adding Solution...' : 'Add Solution'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
