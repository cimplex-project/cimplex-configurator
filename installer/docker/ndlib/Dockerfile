FROM python:3.6-slim

RUN apt-get update && apt-get install -y git 
WORKDIR /ndlib
RUN git clone https://github.com/GiulioRossetti/ndlib-rest.git .
RUN git checkout e4af38a12b1f11b2b0f8c6cff1a84f305db74933

RUN cp requirements.txt /tmp/

RUN pip install --upgrade pip 
RUN pip install gunicorn
RUN pip install -r /tmp/requirements.txt

EXPOSE 5000

ENTRYPOINT ["/bin/bash"]
CMD ["gunicorn.sh"]