from __future__ import print_function
import time
import requests
import lxml.html
import sqlite3
import re
from textrankr import TextRank
import json
def crawler_main():
    session = requests.Session()
    response = session.get('https://news.naver.com/main/list.nhn?mode=LS2D&mid=shm&sid1=101&sid2=258')
    urls = scrape_list_page(response)
    articles=[]
    print('allo')
    i=0
    for url in urls:
        i+=1
        time.sleep(0.05)
        response = session.get(url)
        article = scrape_detail_page(response)
        articles.append(article)
        if i==4:break
    return articles

def scrape_list_page(response):
    root = lxml.html.fromstring((response.content))
    root.make_links_absolute(response.url)
    for a in root.cssselect('.type06_headline .photo a'):
        url = a.get('href')
        yield url

def scrape_detail_page(response):
    root= lxml.html.fromstring(response.content)
    article = {
        'url' : response.url,
        'title' : root.cssselect('.article_header .article_info h3')[0].text_content(),
        'content' : root.cssselect('.article_body div')[0].text_content()[72:].strip()
    }
    return article

def normalize_spaces(s):
    return re.sub(r'\s+','',s).strip()

articles = crawler_main()
print(articles)
for i in range(len(articles)):
    raw_content=articles[i]['content']
    summarized_content = TextRank(raw_content).summarize()
    articles[i]= (articles[i]['title'],summarized_content)
conn = sqlite3.connect('C:\\Users\\q\\OneDrive - kaist.ac.kr\\KAIST\\2018_winter\\madcamp\\projects\\project3\\MadStock-server\\Server\\res\\articles.db')
cursor = conn.cursor()
select_sql = 'select * from articles'
delete_sql = 'delete from articles'
cursor.execute(select_sql)
cursor.execute(delete_sql)
sql = 'INSERT INTO articles VALUES (?, ?)'
for i in range(len(articles)):
    cursor.execute(sql, articles[i])
conn.commit()
cursor.close()
conn.close()
print('@@@@@@@@@@@@@@@@@@')
print(articles)