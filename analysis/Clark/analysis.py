import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from statsmodels.tsa.seasonal import seasonal_decompose
from statsmodels.tsa.stattools import adfuller
from statsmodels.tsa.statespace.sarimax import SARIMAX
from dotenv import load_dotenv
import numpy as np
import os
import shutil

load_dotenv()
BASE_DIR = os.getenv('BASE_DIR')

def clear_directory(directory_path):
    # Check if the directory exists
    if os.path.exists(directory_path):
        # Iterate over all the entries in the directory
        for entry in os.listdir(directory_path):
            entry_path = os.path.join(directory_path, entry)

            # If it's a file, delete it
            if os.path.isfile(entry_path):
                os.unlink(entry_path)

            # If it's a directory, delete it recursively
            elif os.path.isdir(entry_path):
                shutil.rmtree(entry_path)

    else:
        pass
        # print(f"The directory {directory_path} does not exist.")

directory_to_clear = BASE_DIR + '/graphs/clark'
clear_directory(directory_to_clear)

def eda():
    df['Date'] = pd.to_datetime(df['Date'])
    df.set_index('Date', inplace=True)

    # Exploratory Data Analysis: Plotting the time series
    plt.figure(figsize=(12, 6))
    plt.plot(df.index, df['FootFall'], marker='o', linestyle='-')
    plt.title('Footfall Trend at Clarke Dining Hall')
    plt.xlabel('Date')
    plt.ylabel('Footfall')
    plt.grid(True)
    # plt.show()
    # plt.savefig(BASE_DIR + '/graphs/clark/eda1.png')

    # Decomposing the time series to observe trend, seasonality, and residuals
    decomposition = seasonal_decompose(df['FootFall'], model='additive', period=7) # Assuming a weekly seasonality

    # Plotting the decomposed time series components
    fig, (ax1, ax2, ax3) = plt.subplots(3, 1, figsize=(12, 10))
    decomposition.trend.plot(ax=ax1, title='Trend')
    decomposition.seasonal.plot(ax=ax2, title='Seasonality')
    decomposition.resid.plot(ax=ax3, title='Residuals')
    plt.tight_layout()
    # plt.show()
    # plt.savefig(BASE_DIR + '/graphs/clark/eda2.png')

def differencing():
    df['D_diff'] = df['FootFall'].diff()

    # Plot differenced time series
    plt.plot(df['D_diff'])
    plt.title('Differenced Time Series: Dinner Orders')
    plt.xlabel('Date')
    plt.ylabel('Dinner Orders Count (Differenced)')
    # plt.show()


def check_differencing():
    result_diff = adfuller(df['D_diff'].dropna())
    p_value_diff = result_diff[1]

    if p_value_diff < 0.05:
        print("After differencing, the time series is now stationary.")
    else:
        print("Differencing was not sufficient to achieve stationarity. Further differencing may be needed.")


def model():
    # Manually setting initial parameters for the SARIMA model
    p, d, q = 6, 0, 2  # Non-seasonal parameters
    P, D, Q, m = 1, 1, 1, 7  # Seasonal parameters (weekly seasonality)

    # Fit the SARIMA model
    sarima_model = SARIMAX(df['FootFall'],
                        order=(p, d, q),
                        seasonal_order=(P, D, Q, m),
                        enforce_stationarity=False,
                        enforce_invertibility=False)
    sarima_results = sarima_model.fit()

    # Display the summary of the SARIMA model
    sarima_results.summary()
    return sarima_results


def forecasting(sarima_results):
    # Forecasting the next 30 days
    forecast_days = 30
    forecast = sarima_results.get_forecast(steps=forecast_days)
    original_forecast = forecast
    forecast_index = pd.date_range(start=df.index[-1] + pd.Timedelta(days=1), periods=forecast_days, freq='D')
    forecast_df = pd.DataFrame({'Forecast': forecast.predicted_mean}, index=forecast_index)

    # Plotting the forecast along with historical data
    plt.figure(figsize=(12, 6))
    plt.plot(df['FootFall'], label='Historical Footfall')
    plt.plot(forecast_df['Forecast'], label='Forecasted Footfall', color='red')
    plt.title('Footfall Forecast for Next 30 Days at Clarke Dining Hall')
    plt.xlabel('Date')
    plt.ylabel('Footfall')
    plt.legend()
    plt.grid(True)
    # plt.show()
    plt.savefig(BASE_DIR + '/graphs/clark/forecasting.png')


directory_to_clear = BASE_DIR + '/graphs/clark'
clear_directory(directory_to_clear)

# Load the CSV file
file_path = BASE_DIR + '/data/clark_data.csv'
df = pd.read_csv(file_path)
eda()
differencing()
check_differencing()
sarima_results = model()
forecasting(sarima_results)