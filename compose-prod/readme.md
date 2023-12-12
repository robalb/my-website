# production deploy

These are the deployment files for the docker-compose production environment. For more informations read the my-infra repository

```
ansible-playbook -i vps, -e "ansible_port=6477" -u al ansible-deploy.yml
```

