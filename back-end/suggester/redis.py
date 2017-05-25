import redis
from redis._compat import iteritems

class StrictRedis(redis.StrictRedis):
    def zadd(self, name, *args, incr=False, **kwargs):
        """
        NOTE: The order of arguments differs from that of the official ZADD
        command. For backwards compatability, this method accepts arguments
        in the form of name1, score1, name2, score2, while the official Redis
        documents expects score1, name1, score2, name2.

        If you're looking to use the standard syntax, consider using the
        StrictRedis class. See the API Reference section of the docs for more
        information.

        Set any number of element-name, score pairs to the key ``name``. Pairs
        can be specified in two ways:

        As *args, in the form of: name1, score1, name2, score2, ...
        or as **kwargs, in the form of: name1=score1, name2=score2, ...

        The following example would add four values to the 'my-key' key:
        redis.zadd('my-key', 'name1', 1.1, 'name2', 2.2, name3=3.3, name4=4.4)
        """
        pieces = []
        if args:
            if len(args) % 2 != 0:
                raise redis.RedisError("ZADD requires an equal number of "
                                 "values and scores")
            pieces.extend(reversed(args))
        for pair in iteritems(kwargs):
            pieces.append(pair[1])
            pieces.append(pair[0])

        if incr:
            pieces = ['incr'] + pieces

        return self.execute_command('ZADD', name, *pieces)
