import React, { useState, useEffect, useRef } from 'react';
import { Loader, Upload, Leaf } from 'lucide-react';
import { Client } from '@gradio/client';

const HUGGINGFACE_TOKEN = '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';
const GEMINI_API_KEY = 'AIzaSyCrfTRsygEaIl6ndzu3FJrbFAfMyg5n37M';

const PlantDiseaseUI = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [advice, setAdvice] = useState(null);
  const adviceRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const getFormattedAdvice = async (diseaseName) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

    const prompt = `
The detected plant disease is "${diseaseName}".

Please provide a clear, helpful response structured like this:

1. What is it? — A short, simple description of the disease in 2-3 lines.

2. Symptoms — Common signs a farmer would notice.

3. Cure & Treatment — Short, practical advice on how to treat the disease.

4. Prevention Tips — Easy steps a farmer can take to prevent this disease in the future.

Use simple words. No asterisks, symbols, or code formatting.
`;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      });

      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      setAdvice(text || 'Advice not available right now.');
    } catch (error) {
      console.error("Gemini Error:", error);
      setAdvice("Failed to fetch advice.");
    }
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);
    setAdvice(null);

    try {
      const client = await Client.connect("deekshith2525/plant-disease-detector", {
        hf_token: HUGGINGFACE_TOKEN,
      });

      const prediction = await client.predict("/predict", { img: file });
      const disease = prediction.data[0];
      setResult(disease);
      await getFormattedAdvice(disease);
    } catch (err) {
      console.error(err);
      setResult("Error analyzing the image.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adviceRef.current) {
      adviceRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [advice]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-xl p-8 space-y-6">
        <div className="text-center">
          <Leaf className="mx-auto h-10 w-10 text-green-600" />
          <h1 className="text-3xl font-bold text-green-800">Plant Disease Detector</h1>
          <p className="text-gray-500 mt-2">Upload a leaf photo to detect plant disease and get expert guidance.</p>
        </div>

        <div className="flex flex-col items-center gap-4">
          {preview && <img src={preview} alt="Preview" className="w-40 h-40 object-cover rounded-lg shadow" />}

          <label className="cursor-pointer flex items-center gap-2 text-green-600 hover:text-green-800">
            <Upload className="h-5 w-5" />
            <span className="underline">Choose Image</span>
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>

          <button
            onClick={handleSubmit}
            disabled={!file || loading}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-xl transition w-full"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader className="animate-spin h-5 w-5" />
                Analyzing...
              </div>
            ) : (
              'Analyze Leaf'
            )}
          </button>
        </div>

        {result && (
          <div className="bg-green-100 p-4 rounded-xl text-center text-green-900 font-medium shadow-inner">
            🌿 <span className="font-bold">Detected Disease:</span> {result}
          </div>
        )}

        {advice && (
          <div
            ref={adviceRef}
            className="bg-gray-50 border border-green-200 rounded-xl p-4 shadow-inner text-sm space-y-2 text-gray-800"
          >
            <h2 className="text-lg font-semibold text-green-700 mb-2">Expert Advice</h2>
            {advice.split('\n').map((line, index) => (
              <p
                key={index}
                className={`p-1 ${
                  line.trim().match(/^\d\./) ? 'text-green-800 font-semibold mt-3' : ''
                }`}
              >
                {line}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlantDiseaseUI;
