import os
import subprocess

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SPIDERS_DIR = os.path.join(BASE_DIR, 'scrapy_project', 'spiders')

def run_spiders(suffix='_full.py'):
    for root, dirs, files in os.walk(SPIDERS_DIR):
        for file in files:
            if file.endswith(suffix):
                # เอาชื่อไฟล์ เช่น allthaievent_spider_full.py → allthaievent_spider_full
                spider_name = file.replace('.py', '')
                print(f'🕷️ Running spider: {spider_name}')
                subprocess.run(['python', '-m', 'scrapy', 'crawl', spider_name])

if __name__ == '__main__':
    run_spiders('_full.py')
