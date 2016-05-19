#!/usr/bin/python3
import scrapy

from artistSpiders.items import ArtistItem

#http://www.billboard.com/artists/top-100/2016
#response.xpath('//article[@class="masonry-brick"]/header/h1/a/text()').extract()

INFILE = "billboard-top-artists-urls.txt"

class ArtistsSpider(scrapy.Spider):
    name = "artists"
    allowed_domains = ["billboard.com"]
    #TESTING: start_urls = ['http://www.billboard.com/artists/top-100/1958?page=0']
    start_urls = list()
    with open(INFILE, "r") as f:
      for l in f:
        l = l.rstrip('\n')
        start_urls.append(l)

    def parse(self, response):
        NAME_FILES = "artistOutput/NAME_FILES.txt"
        IMG_FILES = "artistOutput/IMG_FILES.txt"
        name_file = "artistOutput/names/NAME-"+response.url.split("/")[-1] + '.txt'
        img_file = "artistOutput/imgs/IMG-"+response.url.split("/")[-1] + '.txt'
        item = ArtistItem()
        item['name'] = response.xpath('//article[@class="masonry-brick"]/header/h1/a/text()').extract()
        item['img_url'] = response.xpath('//article[@class="masonry-brick"]/div/a/img/@src').extract()
        # with open(name_file, 'w+') as f:
        #     for x in item['name']:
        #       f.write(x + '\n')           
        # with open(img_file, 'w+') as f:
        #     for x in item['img_url']:
        #       f.write(x + '\n')  
        with open(NAME_FILES, 'a') as f:
          f.write(name_file +'\n')
        with open(IMG_FILES, 'a') as f:
          f.write(img_file +'\n')
        yield item