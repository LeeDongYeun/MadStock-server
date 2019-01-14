import sqlite3

def InsertDataBase(code, data, table):
    conn = sqlite3.connect("stocksUTf.db")
    cur = conn.cursor()

    cur.execute('CREATE table if not exists ' + table + ' (code text, open integer, close integer, high integer, low integer, volume integer);')
    cur.execute('INSERT INTO ' + table + ' VALUES(?, ?, ?, ?, ?, ?);', (code, data[0], data[3], data[1], data[2], data[4]))

    conn.commit()
    conn.close()