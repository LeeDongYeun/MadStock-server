import pandas as pd
import subprocess

stockName = pd.read_csv('data/KOSPI200.csv')
stockName = stockName.loc[:, ['name', 'code']]

for i in range(len(stockName)):
    stock = stockName.as_matrix()[i]
    subprocess.call(['python', 'model.py', str(stock[1])])
    print(str(stock[1]))
    break



