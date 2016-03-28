    <?php 

    define('WP_USE_THEMES', false);
    require('blog/wp-blog-header.php'); 
    include('header.php');

    if($wp_query->post_count > 1) {
        $posts = query_posts('posts_per_page=1');
    }

    while ( have_posts() ) : the_post();
    $postbg = get_post_meta($post->ID, 'post-bg', true);
    if($postbg == "") {
        $postbg = 'img/post-bg.jpg';
    }
    ?>
    <!-- Page Header -->

    <!-- Set your background image for this header on the line below. -->

    <header class="intro-header" style="background-image: url(<?php echo $postbg ?>)">
        <div class="container">
            <div class="row">
                <div class="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
                    <div class="post-heading">
                        <h1><?php the_title(); ?></h1>
                        <h2 class="subheading"><?php the_subtitle(); ?></h2>
                        <span class="meta">Posted by <a href="about.php"><?php the_author(); ?></a> on <?php the_time('l, F j Y \a\t g:i A'); ?></span>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <!-- Post Content -->
    <article>
        <div class="container">
            <div class="row">
                <div class="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
                <?php the_content(); ?>
                </div>
            </div>
            <div class="row">
            	<div class="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
            		<div id="disqus_thread"></div>
					<script type="text/javascript">
   					 /* * * CONFIGURATION VARIABLES * * */
   					var disqus_shortname = 'krisztiankurucz';
    					/* * * DON'T EDIT BELOW THIS LINE * * */
    				(function() {
        				var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
       					dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
        				(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
    				})();
					</script>
					<noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript" rel="nofollow">comments powered by Disqus.</a></noscript>
            	</div>
            </div>
            <br/>
        </div>
    </article>
<?php 
    endwhile;
    wp_reset_query();
    include('footer.php'); 
?>