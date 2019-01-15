import pandas as pd
import subprocess

stockName = pd.read_csv('data/KOSPI200.csv')
stockName = stockName.loc[:, ['name', 'code']]

for i in range(len(stockName)):
    stock = stockName.as_matrix()[i]
    print(str(stock[1]))
    subprocess.call(['python', 'RetrainModel.py', str(stock[1])])





