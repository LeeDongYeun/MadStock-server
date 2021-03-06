import sqlite3

def InsertDataBase(code, data, table):
    conn = sqlite3.connect("../Server/res/stocksUTf.db")
    #conn = sqlite3.connect("stocksUTf.db")
    cur = conn.cursor()

    cur.execute('CREATE table if not exists ' + table + ' (code text, open integer, close integer, high integer, low integer, volume integer, increaseRate integer);')
    cur.execute('INSERT INTO ' + table + ' VALUES(?, ?, ?, ?, ?, ?, ?);', (code, data[0], data[3], data[1], data[2], data[4], data[5]))

    conn.commit()
    conn.close()