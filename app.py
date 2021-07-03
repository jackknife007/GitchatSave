# -*- coding: utf-8 -*-

import os
import re
import time
import shutil
from collections import namedtuple

from selenium import webdriver

import config

Chapter = namedtuple("Chapter", ['code', 'url', 'path'])


def save_columns(driver, urls):
    for url in urls:
        save_column(driver, url)


def save_column(driver, url):
    driver.get(url)
    column, chapters = get_column_and_chapter(driver)
    for chapter in chapters:
        save_page(driver, chapter)
    mkdir(column)
    move_chapter_to_column_dir(column, chapters)
    delete_html()
    return 200


def get_column_and_chapter(driver):
    category_elements = driver.execute_script('return document.getElementsByClassName("category")')
    column_element = driver.execute_script('return document.getElementsByClassName("column_img")')
    column_dir = get_abs_path(column_element[0].get_attribute('title'))
    chapters = [format_chapter(category) for category in category_elements]
    return column_dir, chapters


def format_chapter(category_element):
    codes = re.findall(r"clickOnTopic\('(\w+)','(\w+)'", category_element.get_attribute('onClick'))[0]
    url = config.chapter_url % (codes[1], codes[0])
    title = re.sub(r'[?/\\<>|:"*]', '-', '.'.join(category_element.text.split('\n')[:2]))
    return Chapter(codes[0], url, get_abs_path(title + '.html'))


def save_page(driver, chapter):
    driver.get(chapter.url)
    time.sleep(15)
    old_path = get_abs_path(chapter.code + '.html')
    for _ in range(60):
        if os.path.exists(old_path):
            shutil.move(old_path, chapter.path)
            break
        time.sleep(1)
    add_script(chapter)


def add_script(chapter):
    with open(chapter.path, 'a') as f:
        f.write(config.jquery_script)
        f.write(config.management_script)


def get_abs_path(path):
    return os.path.join(config.download_path, path)


def mkdir(column):
    if not os.path.exists(column):
        os.mkdir(column)


def move_chapter_to_column_dir(column_dir, chapters):
    for chapter in chapters:
        shutil.move(chapter.path, os.path.join(column_dir, os.path.basename(chapter.path)))


def delete_html():
    for path in os.listdir(config.download_path):
        if path.endswith('.html'):
            os.remove(get_abs_path(path))


def get_columns_url(driver):
    items = driver.execute_script('return document.getElementsByClassName("column_item")')
    return [item.get_attribute("href") for item in items]


if __name__ == "__main__":
    my_driver = webdriver.Edge()
    my_driver.get(config.column_url)
    if config.download_path == "default":
        input("请先修改config文件中的下载地址为电脑的download文件夹！")
    else:
        print("请完成以下步骤：")
        print("\n".join(config.step_str))
        input("完成后请输入任意字符继续....")
        try:
            while True:
                single_url = input("请输入需要保存到本地的专栏的url(输入exit退出)：")
                if single_url.lower() == "exit":
                    break
                print("保存中....")
                save_column(my_driver, single_url)
                print("保存完成!")
        finally:
            my_driver.quit()
        print("程序将在3秒后退出....")
        time.sleep(3)
