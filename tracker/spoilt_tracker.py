from spoiltracker import ExpiryTracker

expiry_tracker = ExpiryTracker()
expiry_tracker.run(csv_file="data.csv", production_date="2024-01-20", days=7, output_dest="expired_goods_data.csv")
