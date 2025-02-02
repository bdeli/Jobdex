from django.shortcuts import render
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from document.models import *
from user.models import *
from card.models import *
from django.http import JsonResponse
from django.core import serializers
from django.db.models.signals import post_save
from django.shortcuts import redirect
import json
from django.http import Http404

testing = False
SUCCESS = 1
ERR_DOC_EXISTS = -9
ERR_DOC_INVALID = -10
ERR_DOC_DOES_NOT_EXIST = -11


def documents(request):
    if request.user.is_active and request.user.is_authenticated:
        context = {"documents": Document.objects.all().filter(uploaded_by=request.user.user_profile)}
        return render(request, 'documents.html', context)
    return render(request, 'landing.html', {"error_message": -12})

@csrf_exempt
def upload_document(request):
    if request.method == 'GET':
        raise Http404
    name = request.POST['name']
    pdf = request.FILES['pdf']
    user = request.user.user_profile
    if str(pdf).split(".")[-1] != "pdf":
        context = {'documents': Document.objects.all().filter(uploaded_by=request.user.user_profile), 'error_message': ERR_DOC_INVALID}
        return render(request, 'documents.html', context)
    try:
        Document.objects.get(doc_name=name, uploaded_by=request.user.user_profile)
        name += ' (copy) '
        new_document = Document(doc_name=name, pdf=pdf, uploaded_by=request.user.user_profile)
    except Document.DoesNotExist:
        new_document = Document(doc_name=name, pdf=pdf, uploaded_by=request.user.user_profile)
    new_document.save()
    return redirect('documents')

@csrf_exempt
def delete_document(request):
    if request.method == 'GET':
        raise Http404
    try:
        if testing:
            info = request.POST
        else:
            info = json.loads(request.POST.keys()[0])

        doc_id = info['doc_id']
        #user = request.user.user_profile
        #user.documents.filter(unique_id=doc_id).delete()
        #user.save()

        doc = Document.objects.get(unique_id=doc_id)
        doc.delete()
        return JsonResponse({'error_message': SUCCESS}, safe=False)
    except Document.DoesNotExist:
        return JsonResponse({'error_message': ERR_DOC_DOES_NOT_EXIST}, safe=False)

def get_documents(request):
    user = request.user.user_profile
    documents = Document.objects.all().filter(uploaded_by=user)
    documents_output = {}
    for document in documents:
        doc = {}
        doc['date_uploaded'] = document.date_uploaded
        doc['url'] = document.pdf.url
        doc['unique_id'] = document.unique_id
        documents_output[document.doc_name] = doc
    return JsonResponse(documents_output, safe=False)
