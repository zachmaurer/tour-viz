#!/usr/bin/python3

BASE = "http://www.billboard.com/artists/top-100/{year}?page={page}"
OUTFILE = "billboard-top-artists-urls.txt"

def main():
  with open(OUTFILE, 'w') as f:
    for i in range(1958, 2017):
      for p in range(0, 5):
        s = BASE.format(year=i, page=p)
        f.write(s+'\n')

if __name__ == "__main__":
  main()