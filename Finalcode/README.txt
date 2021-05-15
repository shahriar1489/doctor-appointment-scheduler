URLs: 

GET - 
'/'
'/patient' : shows all patient 
'/doctor/' : shows all doctor
'/patient_form' : form for new patient
'/doctor_form' : form for new doctor 
'/patient_custom_form' : For custom query. The resultant query has paitent gte the age number given as input 


You can populate the database using '/patient_form' and 'custom_form'

---------------------

Scope for demo: 

1. AJAX Calls to display doctors
2. One .ejs page to display doctor information 
3. Use populate to make one doctor- many patient relationship (optional) 

---------------------


Q. How do I use AJAX to display the patients in need of urgent medical attention? 
Ans:

1. Write Custom Query ( and check if it returns the correct output) 
2. Create a dropdown box- present/not present 
3. Use AJAX to get output of the dropdown box and return result accordingly 
