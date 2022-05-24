from PIL import Image, ImageOps
import requests, pika

def on_message(channel, method_frame, header_frame, body):
    print(body)
    # open image
    img = Image.open(requests.get("https://www.w3schools.com/howto/img_avatar.png", stream=True).raw)

    # border color
    color = "red"

    # top, right, bottom, left
    border = (20, 20, 20, 20)

    new_img = ImageOps.expand(img, border=border, fill=color)

    # save new image
    new_img.convert("RGB").save("test_image_result.jpg")
    channel.basic_ack(delivery_tag=method_frame.delivery_tag)
    print("Image Processed")



connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
channel = connection.channel()
channel.queue_declare(queue='editImage')

channel.basic_consume('editImage', on_message)

try:
    print("Waiting for news images...")
    channel.start_consuming()
except KeyboardInterrupt:
    channel.stop_consuming()

connection.close()
