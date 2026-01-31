import boto3
import uuid
from fastapi import UploadFile
import io
import os
from dotenv import load_dotenv

load_dotenv()

AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_S3_BUCKET = os.getenv("AWS_S3_BUCKET")
AWS_S3_REGION = os.getenv("AWS_S3_REGION")

s3 = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_S3_REGION
)

def upload_file_to_s3(file_obj, filename: str) -> str:
    key = f"videos/{uuid.uuid4()}_{filename}"
    s3.upload_fileobj(file_obj, AWS_S3_BUCKET, key, ExtraArgs={"ContentType": "video/mp4"})
    return f"https://{AWS_S3_BUCKET}.s3.{AWS_S3_REGION}.amazonaws.com/{key}"

def upload_text_to_s3(text: str, filename: str) -> str:
    key = f"transcripts/{filename}"
    file_obj = io.BytesIO(text.encode("utf-8"))
    s3.upload_fileobj(file_obj, AWS_S3_BUCKET, key, ExtraArgs={"ContentType": "text/plain; charset=utf-8"})
    return f"https://{AWS_S3_BUCKET}.s3.{AWS_S3_REGION}.amazonaws.com/{key}"
