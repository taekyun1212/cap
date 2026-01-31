import ffmpeg
import os
import tempfile

def split_video_into_chunks(file_path: str, chunk_duration: int = 10) -> list:
    output_dir = tempfile.mkdtemp()
    output_template = os.path.join(output_dir, "chunk_%03d.mp4")
    print(f"📁 청크 출력 경로 템플릿: {output_template}")  # 경로 확인용

    try:
        (
            ffmpeg
            .input(file_path)
            .output(
                output_template,
                f="segment",
                segment_time=chunk_duration,
                reset_timestamps=1,
                c="copy"
            )
            .run(capture_stdout=True, capture_stderr=True, overwrite_output=True)
        )
    except ffmpeg.Error as e:
        try:
            stdout_decoded = e.stdout.decode("utf-8", errors="replace")
            stderr_decoded = e.stderr.decode("utf-8", errors="replace")
        except Exception as decode_error:
            print("❌ 디코딩 에러 발생:", decode_error)
            stdout_decoded = str(e.stdout)
            stderr_decoded = str(e.stderr)

        print("⚠️ ffmpeg stdout:\n", stdout_decoded)
        print("❌ ffmpeg stderr:\n", stderr_decoded)
        raise

    return sorted([
        os.path.join(output_dir, f)
        for f in os.listdir(output_dir)
        if f.endswith(".mp4")
    ])
