# AI 영상 음성 → 텍스트 요약 서비스

영상 파일을 업로드하면  
**영상 청크 분할 → 음성 인식(STT) → 결과 캐싱 → 텍스트 병합 → AI 요약**  
과정을 자동으로 수행하는 AI 기반 텍스트 변환 서비스입니다.

> 대용량 영상에서 발생하는 느린 STT 처리 문제를  
> **ffmpeg 청크 분할 + Redis 캐싱**으로 개선하는 데 초점을 둔 프로젝트입니다.

---

##  프로젝트 개요

- **프로젝트 유형**: 팀 프로젝트 (FE 1명 , BE 1명 , AI 1명)
- **목표**
  - FastAPI를 중심으로 STT 파이프라인을 오케스트레이션하여 전체 흐름을 제어
  - 대용량 영상 STT 처리 성능 개선
  - 중복 연산 최소화를 통한 서버 부하 감소
- **핵심 포인트**
  - 청크 단위 STT 처리
  - Redis를 활용한 결과 캐싱
  - AWS 기반 파일 저장 및 관리

---

##  주요 기능

- 영상 파일 업로드 (mp4)
- ffmpeg를 이용한 영상 청크 분할
- 로컬 Whisper 모델 기반 음성 → 텍스트 변환(STT)
- Redis 캐싱을 통해 청크 및 STT 결과를 저장하여 중복 연산 방지
- AWS S3에 원본 영상 및 최종 텍스트 저장
- OpenAI API를 활용한 텍스트 요약


---

##  기술 스택

### Backend
- Python
- FastAPI
- Whisper
- SQLAlchemy

### Frontend
- React
- Axios
- CSS

### Infrastructure
- AWS EC2
- AWS S3
- AWS RDS (MySQL)
- Redis
- Nginx

### Tools & APIs
- ffmpeg
- OpenAI API

---

##  시스템 아키텍처

<img width="400" height="800" alt="Group 21" src="https://github.com/user-attachments/assets/d4424ed3-7907-4f0d-a771-01f2a83f8dec" />

## 데이터 흐름도(Data Flow)

<img width="500" height="1100" alt="Group 22" src="https://github.com/user-attachments/assets/453045a8-969c-4428-b0fc-38a85998e13f" />




