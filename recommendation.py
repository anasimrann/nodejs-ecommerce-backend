# cell#1

import os
import numpy as np
import pandas as pd
from tqdm import tqdm
import tensorflow as tf
from PIL import Image
from tensorflow.keras.models import load_model
from tensorflow.keras.applications import resnet
import matplotlib.pyplot as plt
from skimage import io
# %cd C:\Users\Dell\Downloads\yolov5
# %cd 
# %matplotlib inline

# cell#2
LOADED_MODELS = dict()
LOADED_CSVS = dict()
TARGET_SHAPE = (224,224,3)

# cell#3
from PIL import Image
import numpy as np
import matplotlib.pyplot as plt
import torch
from PIL import Image
# from detect import generate_bbox  # Import the generate_bbox function
# %matplotlib inline


def generate_bbox(img_path, conf_thres=0.5):
    # Load model
    weights = r'./recommendation_assets/last.pt'
    model = torch.hub.load('ultralytics/yolov5', 'custom', path=weights)

    # Convert to tensor and add batch dimension
    results = model(img_path)
    return results.xyxy[0].cpu().numpy()
    # Return the numpy array of predictions

def preprocess_image1(filename):
    """
    Load the specified file as a JPEG image, preprocess it and
    resize it to the target shape for Gender Classification
    """
    image_string = tf.io.read_file(filename)
    image = tf.image.decode_jpeg(image_string, channels=3)
    image = tf.image.resize(image, TARGET_SHAPE[:2])
    return tf.expand_dims(image, axis=0)

def preprocess_image2(filename):
    """
    Load the specified file as a JPEG image, preprocess it and
    resize it to the target shape for Embedding Generation
    """
    image_string = tf.io.read_file(filename)
    image = tf.image.decode_jpeg(image_string, channels=3)
    image = tf.image.convert_image_dtype(image, tf.float32)
    image = tf.image.resize(image, TARGET_SHAPE[:2])
    image = resnet.preprocess_input(image)
    return tf.expand_dims(image, axis=0)

def load_models():
    """
    Load Various Models for Recommendation Engine Pipeline
    """
    if len(LOADED_MODELS) == 5:
        return True
    else:
        print("Loading Models...")
        try:
            GENDER_CLASSIFIER = load_model(r"./recommendation_assets/embedding/gender_classification_modell.h5")        
            TOPWEAR_EMBEDDING = load_model(r"./recommendation_assets/embedding/topwear_embedding.h5")
            BOTTOMWEAR_EMBEDDING = load_model(r"./recommendation_assets/embedding/bottomwear_embedding.h5")
            FOOTWEAR_EMBEDDING = load_model(r"./recommendation_assets/embedding/footwear_embedding.h5")
            BAG_EMBEDDING = load_model(r"./recommendation_assets/embedding/bag_embedding.h5")
            
            LOADED_MODELS["gender_classifier"] = GENDER_CLASSIFIER
            LOADED_MODELS["topwear"] = TOPWEAR_EMBEDDING
            LOADED_MODELS["bottomwear"] = BOTTOMWEAR_EMBEDDING
            LOADED_MODELS["footwear"] = FOOTWEAR_EMBEDDING
            LOADED_MODELS["bag"] = BAG_EMBEDDING
            
            print("All models loaded successfully!")
            return True
        except Exception as e:
            print("Error loading models:", e)
            return False

    
def load_CSVs():
    """
    Load Various CSV files for Embedding Generation Pipeline
    """
    if len(LOADED_CSVS) == 7:
        return True
    else:
        print("Loading CSVs...")
        MENS_TOPWEAR_CSV = pd.read_csv(r"./recommendation_assets/CSVS/mens_topwear_embedding.csv")
        MENS_BOTTOMWEAR_CSV = pd.read_csv(r"./recommendation_assets/mens_bottomwear_embedding.csv")
        MENS_FOOTWEAR_CSV = pd.read_csv(r"./recommendation_assets/mens_footwear_embedding.csv")
        WOMENS_TOPWEAR_CSV = pd.read_csv(r"./recommendation_assets/womens_topwear_embedding.csv")
        WOMENS_BOTTOMWEAR_CSV = pd.read_csv(r"./recommendation_assets/womens_bottomwear_embedding.csv")
        WOMENS_FOOTWEAR_CSV = pd.read_csv(r"./recommendation_assets/womens_footwear_embedding.csv")
        WOMENS_BAG_CSV = pd.read_csv(r"./recommendation_assets/womens_bag_embedding.csv")
        
        LOADED_CSVS["mens_topwear"] = MENS_TOPWEAR_CSV
        LOADED_CSVS["mens_bottomwear"] = MENS_BOTTOMWEAR_CSV
        LOADED_CSVS["mens_footwear"] = MENS_FOOTWEAR_CSV
        LOADED_CSVS["womens_topwear"] = WOMENS_TOPWEAR_CSV
        LOADED_CSVS["womens_bottomwear"] = WOMENS_BOTTOMWEAR_CSV
        LOADED_CSVS["womens_footwear"] = WOMENS_FOOTWEAR_CSV
        LOADED_CSVS["womens_bag"] = WOMENS_BAG_CSV
        print("CSVs Loaded!")
        return True


def extract_clothes(image):
    '''
    Extract Topwear, Bottomwear, Footwear, and Bag from a given Image
    Note: In case there are multiple items of the same class, the item with the highest confidence score is returned.

    Args:
        image: Path to the image file that you want to extract clothes from.

    Returns:
        outputs: Dict[numpy.ndarray], Dictionary containing detected Object Class as Keys and the image slice as Values. Also contains the original image.
    '''
    temporary_image_storage = False
    if isinstance(image, str):
        img_path = image
        image = Image.open(img_path)
    elif isinstance(image, np.ndarray):
        img_path = os.path.join("temp", "example.jpg")
        saved_image = Image.fromarray(np.uint8(image))
        saved_image.save(img_path)
        image = Image.open(img_path)
        temporary_image_storage = True

    results = generate_bbox(img_path, conf_thres=0.5)

    if temporary_image_storage:
        os.remove(img_path)

    # Initialize variables to store the highest confidence scores
    topwear_score, bottomwear_score, footwear_score, bag_score = 0, 0, 0, 0
    outputs = {"original_image": image}

    for row in results:
        class_id = int(row[5])  # Extract the class ID
        conf = row[4]  # Extract the confidence score
        x_min, y_min, x_max, y_max = row[:4]  # Extract the bounding box coordinates

        class_name = None
        if class_id == 0:
            class_name = "Topwear"
        elif class_id == 1:
            class_name = "Bottomwear"
        elif class_id == 2:
            class_name = "Footwear"
        elif class_id == 3:
            class_name = "Bag"

        if class_name is not None:
            if class_name == "Topwear" and conf > topwear_score:
                topwear_score = conf
                outputs["topwear"] = image.crop((x_min, y_min, x_max, y_max))
            elif class_name == "Bottomwear" and conf > bottomwear_score:
                bottomwear_score = conf
                outputs["bottomwear"] = image.crop((x_min, y_min, x_max, y_max))
            elif class_name == "Footwear" and conf > footwear_score:
                footwear_score = conf
                outputs["footwear"] = image.crop((x_min, y_min, x_max, y_max))
            elif class_name == "Bag" and conf > bag_score:
                footwear_score = conf
                outputs["bag"] = image.crop((x_min, y_min, x_max, y_max))

    return outputs

# Define the plot_clothes function (unchanged)
def plot_clothes(**images):
    n = len(images)
    plt.figure(figsize=(16, 5))
    for i, (name, image) in enumerate(images.items()):
        plt.subplot(1, n, i + 1)
        plt.axis("off")
        plt.title(' '.join(name.split('_')).title())
        plt.imshow(image)
    plt.show()

    
def generate_embedding(outputs, detected_objects):
    """
    Generate Embeddings for Cropped Outputs from the Object Detection Module
    
    Args:
        outputs: Dict[] objects containing Image slices for cropped detections
        detected_objects: List[] names of the detected objects like topwear, bottomwear and footwear
    
    Returns:
        outputs: Outputs with embeddings for each detected objects.
    """
    for output in detected_objects:
        image = outputs[output]
        img_path = os.path.join("temp","example.jpg")
        saved_image = image
        saved_image.save(img_path)
        image = preprocess_image2(img_path)
        embedding = LOADED_MODELS[output](image)[0].numpy().astype(np.float32).tolist()
        outputs[output+"_embedding"] = embedding
        os.remove(img_path)
    return outputs

def __get__(csv_file, query):
    """
    Plot Top 10 similar products for each category along with the Product Link.
    """
    csv_file['distance'] = csv_file['embedding'].apply(lambda x: np.linalg.norm(np.asarray(eval(x), dtype=np.float32) - np.asarray(query, dtype=np.float32)))
    csv_file = csv_file.sort_values(by='distance').reset_index(drop=True)
    result = csv_file.iloc[:8][['product_url', 'image_url']].to_dict('records')
    for i, row in csv_file.iloc[:8].iterrows():
        plt.figure(figsize=(16,9))
        image = io.imread("..\\"+row["image_path"])
        plt.imshow(image);plt.axis("off");plt.show()
        print("Shop Now @ ", row["product_url"])
        print(254*"=")
    return result

def get_results(outputs, gender, detected_objects):
    """
    Get Similar products for a given input containing query product.
    """
    dict_results = dict()
    for output in detected_objects:
        csv_file = gender + "_" + output
        csv_file = LOADED_CSVS[csv_file].copy(deep=True)
        query = outputs[output+"_embedding"]
        dict_results[output] = __get__(csv_file, query)
    return dict_results

def final(images):
    """
    The complete pipeline for recommending similar fashion products based on a query image.
    """
    if isinstance(images, str):
        images = [images]
    if load_models() and load_CSVs():
        for img_path in images:
            inputs = preprocess_image1(img_path)
            gender_score = LOADED_MODELS["gender_classifier"](inputs)[0][0].numpy()
            gender = "mens" if  gender_score < 0.5 else "womens"
            outputs = extract_clothes(img_path)
            detected_objects = [k for k in outputs if k != "original_image"]
            plot_clothes(**outputs)
            outputs = generate_embedding(outputs, detected_objects)
            results = get_results(outputs, gender, detected_objects)

# cell#4
img_path = r"./recommendation_assets/1702073747521-105.JPG"
final(img_path)