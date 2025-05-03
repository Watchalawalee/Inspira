FROM python:3.10-slim

# ติดตั้ง cron และ dependencies
RUN apt-get update && apt-get install -y cron procps && \
    pip install --no-cache-dir pandas pymongo requests dateparser

# สร้าง directory และ set path
WORKDIR /app
COPY . /app

# เพิ่ม log folder
RUN mkdir -p /app/logs

# ติดตั้ง crontab
COPY crontab /etc/cron.d/scheduler-cron
RUN chmod 0644 /etc/cron.d/scheduler-cron
RUN touch /etc/crontab /etc/cron.d/scheduler-cron

# สั่งให้ cron รัน foreground
CMD ["cron", "-f"]
