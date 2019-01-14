import sklearn
import sklearn.preprocessing
import tensorflow as tf
import numpy as np
import pandas as pd
import sys


#code = str(sys.argv[1])
#print('data/' + code + '.csv')
code = "KOSPI"
directoryName = str("models/" + code)

df = pd.read_csv('data/' + code + '.csv')
df = df.loc[:, ['Date', 'Open', 'High', 'Low', 'Close', 'Volume']]

def normalize_data(df):
    min_max_scaler = sklearn.preprocessing.MinMaxScaler()
    df['Open'] = min_max_scaler.fit_transform(df.Open.values.reshape(-1, 1))
    df['High'] = min_max_scaler.fit_transform(df.High.values.reshape(-1, 1))
    df['Low'] = min_max_scaler.fit_transform(df.Low.values.reshape(-1, 1))
    df['Close'] = min_max_scaler.fit_transform(df['Close'].values.reshape(-1, 1))
    df['Volume'] = min_max_scaler.fit_transform(df['Volume'].values.reshape(-1, 1))
    return df

def load_data(stock, seq_len):
    data_raw = stock.as_matrix()  # convert to numpy array
    data = []

    # create all possible sequences of length seq_len
    for index in range(len(data_raw) - seq_len):
        data.append(data_raw[index: index + seq_len])

    data = np.array(data);
    last_second_data = np.array([data[-2][1:, :]])
    last_data = np.array([data[-1][1:, :]])

    prediction_data = data[:, :-1, :]

    result = np.append(prediction_data, last_data, axis=0)

    return [result, last_data]

# choose one stock
df_stock = df.copy()
df_stock.drop(['Date'], 1, inplace=True)

cols = list(df_stock.columns.values)
print('df_stock.columns.values = ', cols)

# normalize stock
df_stock_norm = df_stock.copy()
df_stock_norm = normalize_data(df_stock_norm)

# create train, test data
seq_len = 20  # choose sequence length
n_epochs = 100
prediction_data, new_train = load_data(df_stock_norm, seq_len)

print(new_train)
print('new_train.shape = ', new_train.shape)

#First let's load meta graph and restore weights
saver = tf.train.import_meta_graph(directoryName + './' + code + '.meta')

# Now, let's access and create placeholders variables and
# create feed-dict to feed new data

for op in tf.get_default_graph().get_operations():
    print(op.name)

graph = tf.get_default_graph()

X = graph.get_tensor_by_name("")
loss = graph.get_tensor_by_name("loss:0")
print(loss)
training_op = graph.get_operation_by_name("training_op")
print(training_op)
outputs = graph.get_tensor_by_name("strided_slice:0")
print(outputs)

with tf.Session() as sess:
    saver.restore(sess, directoryName + './' + code)

