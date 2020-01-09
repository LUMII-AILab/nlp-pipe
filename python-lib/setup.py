import pathlib
from setuptools import setup

HERE = pathlib.Path(__file__).parent

README = (HERE / "README.md").read_text()

setup(
    name='nlppipe',
    packages=['nlppipe'],
    version='0.1.0',
    license='gpl-3.0',
    description='Latvian NLP Tool Pipeline',
    long_description=README,
    long_description_content_type="text/markdown",
    url='https://github.com/LUMII-AILab/nlp-pipe',
    keywords=['nlp', 'pipeline', 'lv'],
    install_requires=[
        'kombu',
        'flask',
        'flask-cors',
        'gunicorn',
        'python-dotenv',
    ],
)
