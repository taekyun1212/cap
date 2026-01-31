import React, { useRef, useState } from 'react';
import axios from 'axios';
import '../css/Backgruond.css';
import homeIcon from './home.png';
import downloadIcon from './download.png';
import copyIcon from './copy.png';
import uploadIcon from './upload.png';

function Layout({ children }) {
  const fileInputRef = useRef();
  const [isUploaded, setIsUploaded] = useState(false);
  const [fileName, setFileName] = useState('');
  const [resultText, setResultText] = useState('');

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      await axios.post('http://localhost:3001/uploads', {
        filename: file.name,
        size: file.size,
        uploadedAt: new Date().toISOString()
      });

      // 업로드 후 mock API에서 최신 업로드 목록 가져오기
      const res = await axios.get('http://localhost:3001/uploads');
      const uploads = res.data;

      const latest = uploads[uploads.length - 1]; // 마지막 항목
      setFileName(latest.filename);
      setResultText(`업로드된 파일 이름: ${latest.filename}`);
      setIsUploaded(true);
    } catch (err) {
      console.error('업로드 실패:', err);
      alert('업로드에 실패했습니다.');
    }
  };

  return (
    <div className="outer">
      <div className="header">
        <div style={{ paddingLeft: '20%' }} className="menu-item">
          <img src={homeIcon} alt="홈" className="header-icon" />
          <span className="menu-text">홈</span>
        </div>
      </div>

      <div className="middle">
        <div style={{ fontSize: '5rem' }}> AI 텍스트 변환 서비스</div>
        <br />
        <h2>AI를 활용하여 영상이나 음성을 텍스트로 요약해드립니다.</h2>

        <div className="inner">
          <div className="inner-toolbar">
            <img src={copyIcon} alt="복사" className="toolbar-icon" />
            <img src={downloadIcon} alt="다운로드" className="toolbar-icon" />
          </div>
          <hr className="inner-divider" />
          {children}

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
              <div style={{ padding: '1rem', fontSize: '1rem', lineHeight: '2rem', textAlign: 'center' }}>
                {resultText}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Layout;
