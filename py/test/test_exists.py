# ProjectName SDK exists test

import pytest
from graphitenote_sdk import GraphiteNoteSDK


class TestExists:

    def test_should_create_test_sdk(self):
        testsdk = GraphiteNoteSDK.test(None, None)
        assert testsdk is not None
