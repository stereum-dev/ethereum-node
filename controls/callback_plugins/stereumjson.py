from __future__ import (absolute_import, division, print_function)
from tokenize import String
__metaclass__ = type

DOCUMENTATION = '''
    name: stereumjson
    type: json
    short_description: output in json with additional information for stereum
    version_added: historical
    description:
        - This is the output callback for Stereum Ethereum Node Setup (stereum.net).
    requirements:
      - set as stereumjson in configuration
    options:
      log_folder:
        default: /var/log/ansible/hosts
        description: The folder where log files will be created.
        env:
          - name: ANSIBLE_LOG_FOLDER
        ini:
          - section: callback_log_plays
            key: log_folder
'''

import os
import time
import json

from ansible.utils.path import makedirs_safe
from ansible.module_utils.common.text.converters import to_bytes
from ansible.module_utils.common._collections_compat import MutableMapping
from ansible.parsing.ajson import AnsibleJSONEncoder
from ansible.plugins.callback import CallbackBase
from ansible.playbook.task import Task
from ansible.executor.task_result import TaskResult

class CallbackModule(CallbackBase):

    CALLBACK_VERSION = 2.0
    CALLBACK_TYPE = 'stdout'
    CALLBACK_NAME = 'stereumjson'

    def __init__(self):
        self._play = None
        self._last_task_banner = None
        self._last_task_name = None
        self._task_type_cache = {}
        super(CallbackModule, self).__init__()

    MSG_FORMAT = "%(now)s  -  %(playbook)s  -  %(task_name)s  -  %(task_action)s  -  %(category)s  -  %(data)s\n>\n"

    def __init__(self):

        super(CallbackModule, self).__init__()

    def set_options(self, task_keys=None, var_options=None, direct=None):
        super(CallbackModule, self).set_options(task_keys=task_keys, var_options=var_options, direct=direct)

        self.log_folder = self.get_option("log_folder")

        if not os.path.exists(self.log_folder):
            makedirs_safe(self.log_folder)

    def log_json(self, host, playbook, taskname, taskaction, category, data):
        path = os.path.join(self.log_folder, host)

        msg = to_bytes(
            self.MSG_FORMAT
            % dict(
                now=time.time_ns(),
                playbook=playbook,
                task_name=taskname,
                task_action=taskaction,
                category=category,
                data=data,
            )
        )
        with open(path, "ab") as fd:
            fd.write(msg)

    def log(self, result, category):
        data = "nodata"
        taskname = "unknown"
        taskaction = "unknown"
        if isinstance(result, TaskResult):
            taskname = result._task.name
            taskaction = result._task.action

            data = result._result
            if isinstance(data, MutableMapping):
                data = data.copy()
                invocation = data.pop('invocation', None)
                data = json.dumps(data, cls=AnsibleJSONEncoder)
                # if invocation is not None:
                #     data = json.dumps(invocation) + " => %s " % data
        elif isinstance(result, str):
            taskname = result
        elif isinstance(result, Task):
            taskname = result.get_name()

        self.log_json("localhost", self.playbook, taskname, taskaction, category, data)

    def v2_runner_on_failed(self, result, ignore_errors=False):
        self.log(result, 'FAILED')

    def v2_runner_on_ok(self, result):
        self.log(result, 'OK')

    def v2_runner_on_skipped(self, result):
        self.log(result, 'SKIPPED')

    def v2_runner_on_unreachable(self, result):
        self.log(result, 'UNREACHABLE')

    def v2_runner_on_async_failed(self, result):
        self.log(result, 'ASYNC_FAILED')

    def v2_playbook_on_start(self, playbook):
        self.playbook = playbook._file_name

    def v2_playbook_on_task_start(self, task, is_conditional):
        self.log(task, "START_TASK")

    def v2_playbook_on_import_for_host(self, result, imported_file):
        self.log(result, 'IMPORTED', imported_file)

    def v2_playbook_on_not_import_for_host(self, result, missing_file):
        self.log(result, 'NOTIMPORTED', missing_file)