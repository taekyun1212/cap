import React, { useRef, useState } from 'react';
import axios from 'axios';
import './css/Backgruond.css'; 
import downloadIcon from './components/download.png';
import copyIcon from './components/copy.png';
import uploadIcon from './components/upload.png';
import ReIcon from './components/Restart.png';

function App() {
  
  const fileInputRef = useRef();
  const [isUploaded, setIsUploaded] = useState(false);
  const [fileName, setFileName] = useState('');
  const [videoId, setVideoId] = useState(null);
  const [resultText, setResultText] = useState('');
  const [progress, setProgress] = useState(null);


  const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  console.log('파일 선택됨:', file.name);  //  
  
  let interval = null;
  try {
    const formData = new FormData();
    formData.append('file', file);

     setResultText('파일 업로드 중...');
    // 1. 업로드
    const uploadRes = await axios.post(`${API_BASE}/upload-and-chunk`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
  });
    

    const videoId = uploadRes.data.video_id;
    setVideoId(videoId);
    setFileName(file.name);
    setIsUploaded(true);
    setResultText(`업로드 완료 (청크 수: ${uploadRes.data.chunk_count})`);

    // STT 진행률 표시
    setProgress(0);
    interval = setInterval(async () => {
      try {
        const res = await axios.get(`${API_BASE}/transcribe-progress/${videoId}`);
        setProgress(res.data.progress);
      } catch (e) {
        console.error("진행률 확인 실패:", e);
      }
    }, 2000); // 0.5초 간격

    // 2. STT
    const sttRes = await axios.post(`${API_BASE}/run-transcribe/${videoId}`);
    setResultText(prev => prev + `\n\n STT 완료 (청크 ${sttRes.data.transcribed_chunks}개)`);

    // STT 진행률 숨기기
    clearInterval(interval);
    setProgress(null); 

    // 3. 자막 병합
    const mergeRes = await axios.post(`${API_BASE}/merge-transcript/${videoId}`);
    setResultText(prev => prev + `\n\n 자막 병합 완료\n링크: ${mergeRes.data.transcript_url}`);

    // 4. 요약
    const summaryRes = await axios.post(`${API_BASE}/summarize-transcript/${videoId}`);
    setResultText(prev => prev + `\n\n 요약 결과:\n\n${summaryRes.data.summary}`);

  } catch (err) {
    console.error(err);
    alert('처리 중 오류가 발생했습니다.');

    clearInterval(interval);
    setProgress(null); 
  }

};

  const handleCopy = () => {
    const textarea = document.createElement("textarea");
    textarea.value = resultText;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      alert("복사되었습니다.");
    } catch (err) {
      alert("복사 실패");
    }
    document.body.removeChild(textarea);
  };


  const handleDownload = () => {
    const blob = new Blob([resultText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName || 'summary'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const hadleRestart = () => {
    setIsUploaded(false);
    setFileName('');
    setVideoId(null);
    setResultText('');
    setProgress(null);
  };

  return (
    <div className="outer">
      <div className="header">
        <div style={{ paddingLeft: '20%' }} className="menu-item">
         
        </div>
      </div>

      <div className="middle">
        <div style={{ fontSize: '5rem' }}> AI 텍스트 변환 서비스</div>
        <br />
        <h2>AI를 활용하여 영상이나 음성을 텍스트로 요약해드립니다.</h2>

        <div className="inner">
          <div className="inner-toolbar">
            <img 
              src={copyIcon} 
              alt="복사" 
              className="toolbar-icon" 
              onClick={handleCopy} />
            <img 
              src={downloadIcon} 
              alt="다운로드" 
              className="toolbar-icon" 
              onClick={handleDownload}
              />
            <img 
              src={ReIcon} 
              alt="재시작" 
              className="toolbar-icon" 
              onClick={hadleRestart}
              />
          </div>
          <hr className="inner-divider" />

          {!isUploaded ? (
            <div className="upload-box">
              <img
                src={uploadIcon}
                alt="업로드"
                className="upload-icon"
                onClick={handleUploadClick}
                style={{ cursor: 'pointer' }}
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <div className="upload-text">영상을 업로드 하세요.</div>
              <div className="upload-subtext">
                이모티콘을 클릭하거나 파일을 끌어다 놓으세요. 최대 10GB까지 업로드 가능합니다.
              </div>
            </div>
          ) : (
              <div className="upload-result-box">
              <div style={{ padding: '1rem', fontSize: '1rem', whiteSpace: 'pre-line' }}>{resultText}</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
                {typeof progress === 'number' && progress >= 0 && progress < 100 && (
                  <div style={{ fontSize: '1rem', color: 'green' }}>
                    STT 진행률: {progress}%
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
